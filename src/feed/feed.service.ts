import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { CreateFeedParams } from './feed.interface';
import { FeedClient } from '../internal/social-client/feed/feed.client';
import { ERROR_CODE } from '../lib/exception/error.constant';

@Injectable()
export class FeedService {
  constructor(private readonly feedClient: FeedClient) {}

  /**
   * 피드 생성
   */
  async create(params: CreateFeedParams) {
    try {
      const { shareAlbumId, userId, description, contents } = params;
      const { feedId } = await this.feedClient.create(shareAlbumId, { userId, description, contents });

      return { id: feedId };
    } catch (error) {
      throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
    }
  }
}
