import { Injectable } from '@nestjs/common';
import {
  ConfirmVerificationRequest,
  DefaultApi as UserApiClient,
  SendVerificationRequest,
} from '@ppotto/user-api-client';
import { AxiosError } from 'axios';

import { ERROR_CODE } from '../../../lib/exception/error.constant';
import { UserClientException } from '../user-client.exception';

@Injectable()
export class VerificationClient {
  constructor(private readonly userApiClient: UserApiClient) {}

  /**
   * 인증 요청
   */
  async sendVerification(sendVerificationRequest: SendVerificationRequest) {
    try {
      const response = await this.userApiClient.verificationControllerSendVerification(sendVerificationRequest);
      return response.data;
    } catch (error) {
      throw this.errorHandler(error);
    }
  }

  /**
   * 인증 확인
   */
  async confirmVerification(confirmVerificationRequest: ConfirmVerificationRequest) {
    try {
      const response = await this.userApiClient.verificationControllerConfirmVerification(confirmVerificationRequest);
      return response.data;
    } catch (error) {
      throw this.errorHandler(error);
    }
  }

  private errorHandler(error: any): UserClientException {
    if (error instanceof AxiosError) {
      const errorInfo = error.response?.data || ERROR_CODE.INTERNAL_SERVER_ERROR;
      return new UserClientException(errorInfo, error);
    }

    return new UserClientException(ERROR_CODE.INTERNAL_SERVER_ERROR, error);
  }
}
