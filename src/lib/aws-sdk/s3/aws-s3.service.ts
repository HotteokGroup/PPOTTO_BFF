import { S3, GetObjectCommandInput, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import { GetFileFromS3Options, ResizeImageToWebpOptions, SaveFileToS3Options } from './aws-s3.interface';

@Injectable()
export class AwsS3Service {
  constructor(private readonly s3: S3) {}

  /**
   * S3에서 파일 가져오기
   */
  async getFileFromS3({ bucket, key }: GetFileFromS3Options) {
    const params: GetObjectCommandInput = {
      Bucket: bucket,
      Key: key,
    };

    const data = await this.s3.getObject(params);
    return data.Body as unknown as Buffer;
  }

  /**
   * S3에 파일 저장
   */
  async saveFileToS3({ bucket, key, file }: SaveFileToS3Options) {
    const params: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      Body: file,
      // ContentType: "image/webp",
    };
    await this.s3.putObject(params);
  }

  /**
   * 이미지를 리사이징 후 webP 형식으로 변환하여 리턴한다
   */
  async resizeImageToWebp(params: ResizeImageToWebpOptions): Promise<Buffer> {
    const { image, width, height } = params;

    return sharp(image).withMetadata().resize(width, height).webp({ lossless: true }).toBuffer();
  }
}
