import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dayjs from 'dayjs';

import { CreateFeedContentParams, CreateFeedParams, FeedContent, FeedContentFileUrls } from './feed.interface';
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

    // 피드 콘텐츠 생성
    const feedContents = await Promise.all(
      contents.map(async (content) => this.createFeedContent({ content, userId, shareAlbumId, feedId })),
    );

    try {
      // 생성한 피드 콘텐츠를 미리 생성한 피드에 추가
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

  /**
   * 피드 콘텐츠 생성
   */
  private async createFeedContent({
    content,
    userId,
    shareAlbumId,
    feedId,
  }: CreateFeedContentParams): Promise<FeedContent> {
    // 이미지 형식인지 확인
    if (this.imageProcessingService.isImage(content)) {
      const originalImage = content.buffer;
      const sizes = [222, 714, 1400];

      // 이미지 검증 및 처리
      const { smallImage, mediumImage, largeImage } = await this.imageProcessingService.processImage(content, sizes);
      const userFileStoreId = await this.createUserFileStore(userId);
      const today = dayjs().format('YYYY-MM-DD');

      // 파일 이름 및 URL 생성
      const { originalFileUrl, smallThumbnailUrl, mediumThumbnailUrl, largeThumbnailUrl } = this.generateFileUrls(
        shareAlbumId,
        feedId,
        userFileStoreId,
        today,
      );

      try {
        // S3에 이미지 업로드
        await this.s3.uploadImages({
          bucket: this.bucketName,
          imageUploads: [
            {
              key: originalFileUrl,
              file: originalImage,
            },
            {
              key: smallThumbnailUrl,
              file: smallImage,
            },
            {
              key: mediumThumbnailUrl,
              file: mediumImage,
            },
            {
              key: largeThumbnailUrl,
              file: largeImage,
            },
          ],
        });
      } catch (error) {
        throw new UnprocessableEntityException(ERROR_CODE.IMAGE_UPLOAD_FAILED);
      }

      // DB에 저장된 UserFileStore 수정
      await this.updateUserFileStore(
        userFileStoreId,
        originalFileUrl,
        smallThumbnailUrl,
        mediumThumbnailUrl,
        largeThumbnailUrl,
      );

      return {
        userFileStoreId,
        type: FeedContentType.IMAGE,
        contentSmallUrl: smallThumbnailUrl,
        contentMediumUrl: mediumThumbnailUrl,
        contentLargeUrl: largeThumbnailUrl,
      };
    }

    // TODO: 비디오 처리 추가 예정

    // 콘텐츠 처리 중 알 수 없는 오류가 발생할 경우
    throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
  }

  private async createUserFileStore(userId: number): Promise<string> {
    try {
      const userFileStore = await this.fileStoreClient.create({
        userId,
        contentType: ContentType.FEED_IMAGE,
      });
      return userFileStore.id;
    } catch (error) {
      if (!(error instanceof UserClientException)) {
        throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }

      throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  private generateFileUrls(
    shareAlbumId: string,
    feedId: string,
    userFileStoreId: string,
    today: string,
  ): FeedContentFileUrls {
    const fileName = `${shareAlbumId}_${feedId}_${userFileStoreId}`;
    return {
      originalFileUrl: `${this.originImagePath}/${today}/${fileName}`,
      smallThumbnailUrl: `${this.thumbnailImagePath}/${today}/${fileName}/small.webp`,
      mediumThumbnailUrl: `${this.thumbnailImagePath}/${today}/${fileName}/medium.webp`,
      largeThumbnailUrl: `${this.thumbnailImagePath}/${today}/${fileName}/large.webp`,
    };
  }

  private async updateUserFileStore(
    userFileStoreId: string,
    originalFileUrl: string,
    smallThumbnailUrl: string,
    mediumThumbnailUrl: string,
    largeThumbnailUrl: string,
  ): Promise<void> {
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
  }
}
