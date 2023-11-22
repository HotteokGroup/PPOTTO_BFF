import { Injectable } from '@nestjs/common';
import { AgreeTermsOfServiceRequest, DefaultApi as UserApiClient } from '@ppotto/user-api-client';
import { AxiosError } from 'axios';

import { ERROR_CODE } from '../../../lib/exception/error.constant';
import { UserClientException } from '../user-client.exception';

@Injectable()
export class TermsOfServiceClient {
  constructor(private readonly userApiClient: UserApiClient) {}

  /**
   * 약관 리스트 가져오기
   */
  async getList() {
    try {
      const response = await this.userApiClient.termsOfServiceControllerGetTermsOfServiceList();
      return response.data;
    } catch (error) {
      throw this.errorHandler(error);
    }
  }

  /**
   * 약관 동의하기
   */
  async agree(agreeTermsOfServiceRequest: AgreeTermsOfServiceRequest) {
    try {
      const response = await this.userApiClient.termsOfServiceControllerAgreeTermsOfService(agreeTermsOfServiceRequest);
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
