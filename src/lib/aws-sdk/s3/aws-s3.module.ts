import { S3 } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
  ],
})
export class AwsS3Module {}
