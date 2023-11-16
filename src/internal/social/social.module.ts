import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, DefaultApi as SocialClient } from '@ppotto/social-api-client';

import { ShareAlbumClient } from './share-album/share-album.client';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: SocialClient,
      useFactory: (httpService: HttpService, configService: ConfigService) => {
        const config = new Configuration({ basePath: configService.getOrThrow<string>('SOCIAL_CLIENT_PATH') });
        const axios = httpService.axiosRef;
        return new SocialClient(config, undefined, axios);
      },
      inject: [HttpService, ConfigService],
    },
    ShareAlbumClient,
  ],
  exports: [ShareAlbumClient, SocialClient],
})
export class SocialClientModule {}
