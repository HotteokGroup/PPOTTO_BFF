import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, DefaultApi as SocialApiClient } from '@ppotto/social-api-client';

import { FeedClient } from './feed/feed.client';
import { ShareAlbumClient } from './share-album/share-album.client';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: SocialApiClient,
      useFactory: (httpService: HttpService, configService: ConfigService) => {
        const config = new Configuration({ basePath: configService.getOrThrow<string>('SOCIAL_CLIENT_PATH') });
        const axios = httpService.axiosRef;
        return new SocialApiClient(config, undefined, axios);
      },
      inject: [HttpService, ConfigService],
    },
    FeedClient,
    ShareAlbumClient,
    FeedClient,
  ],
  exports: [ShareAlbumClient, FeedClient, SocialApiClient],
})
export class SocialClientModule {}
