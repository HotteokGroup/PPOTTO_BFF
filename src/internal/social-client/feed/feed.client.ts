import { Injectable } from '@nestjs/common';
import { CreateFeedRequest, DefaultApi as SocialApiClient } from '@ppotto/social-api-client';
import { AxiosError } from 'axios';

import { ERROR_CODE } from '../../../lib/exception/error.constant';
import { SocialClientException } from '../social-client.exception';

@Injectable()
export class FeedClient {
  constructor(private readonly socialApiClient: SocialApiClient) {}

  /**
   * 피드 생성
   */
  async create(shareAlbumId: string, createFeedRequest: CreateFeedRequest) {
    try {
      const response = await this.socialApiClient.feedControllerCreateFeed(shareAlbumId, createFeedRequest);
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
