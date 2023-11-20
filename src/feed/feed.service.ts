import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';

import { CreateFeedParams } from './feed.interface';
import { FeedClient } from '../internal/social-client/feed/feed.client';
import { FeedContentType } from '../internal/social-client/feed/feed.enum';
import { SocialClientException } from '../internal/social-client/social-client.exception';
import { FileStoreClient } from '../internal/user-client/file-store/file-store.client';
import { ContentType } from '../internal/user-client/file-store/file-store.enum';
import { UserClientException } from '../internal/user-client/user-client.exception';
import { AwsS3Service } from '../lib/aws-sdk/s3/aws-s3.service';
import { ERROR_CODE } from '../lib/exception/error.constant';
import { ImageProcessingService } from '../lib/image-processing/image-processing.service';

@Injectable()
export class FeedService {
  private bucketName: string;

  private originImagePath: string;

  private thumbnailImagePath: string;

  constructor(
    private readonly feedClient: FeedClient,
    private readonly fileStoreClient: FileStoreClient,
    private readonly s3: AwsS3Service,
    private readonly imageProcessingService: ImageProcessingService,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');
    this.originImagePath = this.configService.getOrThrow<string>('ORIGIN_IMAGE_PATH');
    this.thumbnailImagePath = this.configService.getOrThrow<string>('THUMBNAIL_IMAGE_PATH');
  }

  /**
   * 피드 생성
   */
  async create(params: CreateFeedParams) {
    const today = dayjs().format('YYYY-MM-DD');
    const { shareAlbumId, userId, description, contents } = params;

    let feedId: string;
    try {
      // 임시 피드 생성
      const feed = await this.feedClient.create(shareAlbumId, { userId, description });
      feedId = feed.feedId;
    } catch (error) {
      if (!(error instanceof SocialClientException)) {
        throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }

      const errorInfo = error.getResponse();
      switch (errorInfo.errorCode) {
        case 'SHARE_ALBUM_NOT_FOUND':
          throw new NotFoundException(ERROR_CODE.SHARE_ALBUM_NOT_FOUND);
        case 'SHARE_ALBUM_MEMBER_NOT_FOUND':
          throw new NotFoundException(ERROR_CODE.SHARE_ALBUM_MEMBER_NOT_FOUND);
        default:
          throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }
    }

    const feedContents = await Promise.all(
      contents.map(async (content) => {
        const file = content;
        const originImage = file.buffer;

        if (this.imageProcessingService.isImage(file)) {
          const sizes = [222, 714, 1400];

          // 이미지 리사이징 및 형식 변경
          const [smallImage, mediumImage, largeImage] = await Promise.allSettled(
            sizes.map(async (size) => {
              const resizedImage = await this.imageProcessingService.resize({ image: originImage, width: size });
              return this.imageProcessingService.toWebp(resizedImage);
            }),
          );

          // 이미지 처리에 실패했을 경우
          if (
            smallImage.status === 'rejected' ||
            mediumImage.status === 'rejected' ||
            largeImage.status === 'rejected'
          ) {
            throw new UnprocessableEntityException(ERROR_CODE.IMAGE_UPLOAD_FAILED);
          }

          let userFileStoreId: string;
          try {
            // 임시 UserFileStore ID 생성
            const userFileStore = await this.fileStoreClient.create({
              userId,
              contentType: ContentType.FeedImage,
            });
            userFileStoreId = userFileStore.id;
          } catch (error) {
            if (!(error instanceof UserClientException)) {
              throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
            }

            throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
          }

          const fileName = `${shareAlbumId}_${feedId}_${userFileStoreId}`;
          const originalFileUrl = `${this.originImagePath}/${today}/${fileName}`;
          const smallThumbnailUrl = `${this.thumbnailImagePath}/${today}/${fileName}/small.webp`;
          const mediumThumbnailUrl = `${this.thumbnailImagePath}/${today}/${fileName}/medium.webp`;
          const largeThumbnailUrl = `${this.thumbnailImagePath}/${today}/${fileName}/large.webp`;

          // S3 업로드
          const [smallImageSaveResult, mediumImageSaveResult, largeImageSaveResult] = await Promise.allSettled([
            this.s3.save({ bucket: this.bucketName, key: originalFileUrl, file: originImage }),
            this.s3.save({ bucket: this.bucketName, key: smallThumbnailUrl, file: smallImage.value }),
            this.s3.save({ bucket: this.bucketName, key: mediumThumbnailUrl, file: mediumImage.value }),
            this.s3.save({ bucket: this.bucketName, key: largeThumbnailUrl, file: largeImage.value }),
          ]);

          // 이미지 업로드에 실패했을 경우
          if (
            smallImageSaveResult.status === 'rejected' ||
            mediumImageSaveResult.status === 'rejected' ||
            largeImageSaveResult.status === 'rejected'
          ) {
            throw new UnprocessableEntityException(ERROR_CODE.IMAGE_UPLOAD_FAILED);
          }

          // 이미지를 USER DB의 UserFileStore에 저장
          try {
            await this.fileStoreClient.modify(userFileStoreId, {
              originalFileUrl,
              smallThumbnailUrl,
              mediumThumbnailUrl,
              largeThumbnailUrl,
            });
          } catch (error) {
            if (!(error instanceof UserClientException)) {
              throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
            }
          }

          // 피드 컨텐츠
          return {
            userFileStoreId,
            type: FeedContentType.Image,
            contentSmallUrl: smallThumbnailUrl,
            contentMediumUrl: mediumThumbnailUrl,
            contentLargeUrl: largeThumbnailUrl,
          };
        }

        // TODO: 비디오 처리 추가 예정

        // 콘텐츠 처리 중 알 수 없는 오류가 발생할 경우
        throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }),
    );

    try {
      // 피드 컨텐츠 추가
      await this.feedClient.modify(shareAlbumId, feedId, {
        contents: feedContents,
      });
    } catch (error) {
      if (!(error instanceof SocialClientException)) {
        throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }

      const errorInfo = error.getResponse();
      switch (errorInfo.errorCode) {
        case 'SHARE_ALBUM_NOT_FOUND':
          throw new NotFoundException(ERROR_CODE.SHARE_ALBUM_NOT_FOUND);
        case 'SHARE_ALBUM_MEMBER_NOT_FOUND':
          throw new NotFoundException(ERROR_CODE.SHARE_ALBUM_MEMBER_NOT_FOUND);
        default:
          throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }
    }

    return { id: feedId };
  }
}
