import { Injectable } from '@nestjs/common';
import { CreateShareAlbumRequest, DefaultApi as SocialClient } from '@ppotto/social-api-client';
import { AxiosError } from 'axios';

import { SocialClientException } from './social-client.exception';
import { ERROR_CODE } from '../../lib/exception/error.constant';

@Injectable()
export class SocialClientService {
  constructor(private readonly socialClient: SocialClient) {}

  async createShareAlbum(createShareAlbumRequest: CreateShareAlbumRequest) {
    try {
      const response = await this.socialClient.shareAlbumControllerCreateShareAlbum(createShareAlbumRequest);
      return response.data;
    } catch (error) {
      throw this.errorHandler(error);
    }
  }

  private errorHandler(error: any): SocialClientException {
    if (error instanceof AxiosError) {
      const errorInfo = error.response?.data || ERROR_CODE.INTERNAL_SERVER_ERROR;
      return new SocialClientException(errorInfo, error);
    }

    return new SocialClientException(ERROR_CODE.INTERNAL_SERVER_ERROR, error);
  }
}
