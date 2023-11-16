import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { CreateShareAlbumParams } from './share-album.interface';
import { SocialClientService } from '../internal/social/social-client.service';
import { ERROR_CODE } from '../lib/exception/error.constant';

@Injectable()
export class ShareAlbumService {
  constructor(private readonly socialClient: SocialClientService) {}

  async createShareAlbum(params: CreateShareAlbumParams) {
    try {
      const { id } = await this.socialClient.createShareAlbum(params);

      return { id };
    } catch (error) {
      throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
    }
  }
}
