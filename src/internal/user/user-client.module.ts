import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, DefaultApi as UserClient } from '@ppotto/user-api-client';

import { UserClientService } from './user-client.service';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: UserClient,
      useFactory: (httpService: HttpService, configService: ConfigService) => {
        const config = new Configuration({ basePath: configService.getOrThrow<string>('USER_CLIENT_PATH') });
        const axios = httpService.axiosRef;
        return new UserClient(config, undefined, axios);
      },
      inject: [HttpService, ConfigService],
    },
    UserClientService,
  ],
  exports: [UserClientService, UserClient],
})
export class UserClientModule {}
