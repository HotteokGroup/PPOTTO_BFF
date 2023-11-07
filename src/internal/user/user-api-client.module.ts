import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, DefaultApi as UserApi } from '@ppotto/user-api-client';

import { UserApiClientService } from './user-api-client.service';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: UserApi,
      useFactory: (httpService: HttpService, configService: ConfigService) => {
        const config = new Configuration({ basePath: configService.getOrThrow<string>('USER_API_PATH') });
        const axios = httpService.axiosRef;
        return new UserApi(config, undefined, axios);
      },
      inject: [HttpService, ConfigService],
    },
    UserApiClientService,
  ],
  exports: [UserApiClientService, UserApi],
})
export class UserApiClientModule {}
