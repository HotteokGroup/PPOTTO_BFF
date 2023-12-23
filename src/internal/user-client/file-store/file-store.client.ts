import { Injectable } from '@nestjs/common';
import { CreateFileRequest, DefaultApi as UserApiClient, ModifyFileRequest } from '@ppotto/user-api-client';
import { AxiosError } from 'axios';

import { ERROR_CODE } from '../../../lib/exception/error.constant';
import { UserClientException } from '../user-client.exception';

@Injectable()
export class FileStoreClient {
  constructor(private readonly userApiClient: UserApiClient) {}

  /**
   * 파일 생성
   */
  async create(createFileRequest: CreateFileRequest) {
    try {
      const response = await this.userApiClient.fileStoreControllerCreateFile(createFileRequest);
      return response.data;
    } catch (error) {
      throw this.errorHandler(error);
    }
  }

  /**
   * 파일 수정
   */
  async modify(fileId: string, modifyFileRequest: ModifyFileRequest) {
    try {
      const response = await this.userApiClient.fileStoreControllerModifyFile(fileId, modifyFileRequest);
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
