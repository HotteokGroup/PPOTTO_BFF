import { S3, GetObjectCommandInput, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

import { AwsS3ServiceGetFileOptions, AwsS3ServiceSaveOptions, UploadImagesParams } from './aws-s3.interface';

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

  /**
   * 여러 이미지를 S3에 업로드
   */
  async uploadImages({ bucket, imageUploads }: UploadImagesParams): Promise<void> {
    const uploadPromises = imageUploads.map(({ key, file }) => this.save({ bucket, key, file }));

    const results = await Promise.allSettled(uploadPromises);

    const rejectedResults = results.filter((result) => result.status === 'rejected');
    if (rejectedResults.length > 0) {
      const errorMessages = rejectedResults
        .map((result) => (result as PromiseRejectedResult).reason.message)
        .join(', ');
      throw new Error(`S3 업로드 실패: ${errorMessages}`);
    }
  }
}
