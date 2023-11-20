import { S3, GetObjectCommandInput, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

import { AwsS3ServiceGetFileOptions, AwsS3ServiceSaveOptions } from './aws-s3.interface';

@Injectable()
export class AwsS3Service {
  constructor(private readonly s3: S3) {}

  /**
   * S3에서 파일 가져오기
   */
  async getFile({ bucket, key }: AwsS3ServiceGetFileOptions) {
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
  async save({ bucket, key, file }: AwsS3ServiceSaveOptions) {
    const params: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      Body: file,
      // ContentType: "image/webp",
    };
    await this.s3.putObject(params);
  }
}
