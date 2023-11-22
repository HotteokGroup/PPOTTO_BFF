import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, DefaultApi as UserApiClient } from '@ppotto/user-api-client';

import { TermsOfServiceClient } from './terms-of-service/terms-of-service.client';
import { UserClient } from './user/user.client';
import { VerificationClient } from './verification/verification.client';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: UserApiClient,
      useFactory: (httpService: HttpService, configService: ConfigService) => {
        const config = new Configuration({ basePath: configService.getOrThrow<string>('USER_CLIENT_PATH') });
        const axios = httpService.axiosRef;
        return new UserApiClient(config, undefined, axios);
      },
      inject: [HttpService, ConfigService],
    },
    UserClient,
    TermsOfServiceClient,
    VerificationClient,
  ],
  exports: [UserClient, TermsOfServiceClient, VerificationClient, UserApiClient],
})
export class UserClientModule {}
