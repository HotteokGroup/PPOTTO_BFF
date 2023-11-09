import { Injectable } from '@nestjs/common';
import {
  ConfirmVerificationRequest,
  ConfirmVerificationResponse,
  DefaultApi as UserApiClient,
  SendVerificationRequest,
  SendVerificationResponse,
} from '@ppotto/user-api-client';
import { AxiosError } from 'axios';

import { UserApiException } from './user-api-client.exception';
import { ERROR_CODE } from '../../lib/exception/error.constant';

@Injectable()
export class UserApiClientService {
  constructor(private readonly userApiClient: UserApiClient) {}

  async sendVerification(sendVerificationRequest: SendVerificationRequest): Promise<SendVerificationResponse> {
    try {
      const response = await this.userApiClient.verificationControllerSendVerification(sendVerificationRequest);
      return response.data;
    } catch (error) {
      return this.errorHandler(error);
    }
  }

  async confirmVerification(
    confirmVerificationRequest: ConfirmVerificationRequest,
  ): Promise<ConfirmVerificationResponse> {
    try {
      const response = await this.userApiClient.verificationControllerConfirmVerification(confirmVerificationRequest);
      return response.data;
    } catch (error) {
      return this.errorHandler(error);
    }
  }

  private errorHandler(error: any): never {
    if (error instanceof AxiosError) {
      // 정의된 에러코드가 없을 시 INTERNAL_SERVER_ERROR
      const errorCode = error.response?.data?.errorCode || ERROR_CODE.INTERNAL_SERVER_ERROR.errorCode;
      const errorInfo = ERROR_CODE[errorCode];

      throw new UserApiException(errorInfo, error);
    }

    throw new UserApiException(ERROR_CODE.INTERNAL_SERVER_ERROR, error);
  }
}
