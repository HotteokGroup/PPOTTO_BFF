import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfirmVerificationRequest, DefaultApi as UserClient, SendVerificationRequest } from '@ppotto/user-api-client';
import { AxiosError } from 'axios';

import { UserClientException } from './user-client.exception';
import { ERROR_CODE } from '../../lib/exception/error.constant';

@Injectable()
export class UserClientService {
  constructor(private readonly userClient: UserClient) {}

  async sendVerification(sendVerificationRequest: SendVerificationRequest) {
    try {
      const response = await this.userClient.verificationControllerSendVerification(sendVerificationRequest);
      return response.data;
    } catch (error) {
      throw this.errorHandler(error);
    }
  }

  async confirmVerification(confirmVerificationRequest: ConfirmVerificationRequest) {
    try {
      const response = await this.userClient.verificationControllerConfirmVerification(confirmVerificationRequest);
      return response.data;
    } catch (error) {
      throw this.errorHandler(error);
    }
  }

  private errorHandler(error: any): UserClientException | InternalServerErrorException {
    if (error instanceof AxiosError) {
      const errorInfo = error.response?.data || ERROR_CODE.INTERNAL_SERVER_ERROR;
      return new UserClientException(errorInfo, error);
    }

    return new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
  }
}
