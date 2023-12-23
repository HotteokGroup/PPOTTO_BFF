import { S3 } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AwsS3Service } from './aws-s3.service';

@Module({
  imports: [],
  providers: [
    {
      provide: S3,
      useFactory: (configService: ConfigService) => {
        return new S3({
          region: configService.getOrThrow<string>('AWS_REGION'),
          credentials: {
            accessKeyId: configService.getOrThrow<string>('AWS_ACCESS_KEY'),
            secretAccessKey: configService.getOrThrow<string>('AWS_SECRET_KEY'),
          },
        });
      },
      inject: [ConfigService],
    },
    AwsS3Service,
  ],
  exports: [AwsS3Service],
})
export class AwsS3Module {}
