import { Module } from '@nestjs/common';

import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { SocialClientModule } from '../internal/social-client/social-client.module';
import { UserClientModule } from '../internal/user-client/user-client.module';
import { AwsS3Module } from '../lib/aws-sdk/s3/aws-s3.module';
import { ImageProcessingModule } from '../lib/image-processing/image-processing.module';
import { JwtUtilityModule } from '../lib/jwt/jwt-utility.module';

@Module({
  imports: [JwtUtilityModule, SocialClientModule, UserClientModule, ImageProcessingModule, AwsS3Module],
  providers: [FeedService],
  controllers: [FeedController],
})
export class FeedModule {}
