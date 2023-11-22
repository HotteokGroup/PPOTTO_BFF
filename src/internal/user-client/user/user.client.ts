import { Injectable } from '@nestjs/common';
import { CreateUserRequest, DefaultApi as UserApiClient, LoginUserByEmailRequest } from '@ppotto/user-api-client';
import { AxiosError } from 'axios';

import { ERROR_CODE } from '../../../lib/exception/error.constant';
import { UserClientException } from '../user-client.exception';

@Injectable()
export class UserClient {
  constructor(private readonly userApiClient: UserApiClient) {}

  /**
   * 유저정보 & 약관 동의정보 조회
   */
  async getInfo(userId: number) {
    try {
      const response = await this.userApiClient.userControllerGetUserInfo(userId);
      return response.data;
    } catch (error) {
      throw this.errorHandler(error);
    }
  }

  /**
   * 이메일로 로그인
   */
  async loginByEmail(loginUserByEmailRequest: LoginUserByEmailRequest) {
    try {
      const response = await this.userApiClient.userControllerLoginByEmail(loginUserByEmailRequest);
      return response.data;
    } catch (error) {
      throw this.errorHandler(error);
    }
  }

  /**
   * 유저 생성
   */
  async create(createUserRequest: CreateUserRequest) {
    try {
      const response = await this.userApiClient.userControllerCreateUser(createUserRequest);
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
