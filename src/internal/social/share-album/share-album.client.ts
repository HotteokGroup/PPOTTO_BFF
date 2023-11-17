import { Injectable } from '@nestjs/common';
import {
  CreateShareAlbumRequest,
  DefaultApi as SocialClient,
  ModifyShareAlbumRequest,
} from '@ppotto/social-api-client';
import { AxiosError } from 'axios';

import { ERROR_CODE } from '../../../lib/exception/error.constant';
import { SocialClientException } from '../social.exception';

@Injectable()
export class ShareAlbumClient {
  constructor(private readonly socialClient: SocialClient) {}

  /**
   * 공유앨범 생성
   */
  async create(createShareAlbumRequest: CreateShareAlbumRequest) {
    try {
      const response = await this.socialClient.shareAlbumControllerCreateShareAlbum(createShareAlbumRequest);
      return response.data;
    } catch (error) {
      throw this.errorHandler(error);
    }
  }

  /**
   * 공유앨범 조회
   */
  async get(id: string) {
    try {
      const response = await this.socialClient.shareAlbumControllerGetShareAlbum(id);
      return response.data;
    } catch (error) {
      throw this.errorHandler(error);
    }
  }

  /**
   * 공유앨범 수정
   */
  async modify(id: string, modifyShareAlbumRequest: ModifyShareAlbumRequest) {
    try {
      const response = await this.socialClient.shareAlbumControllerModifyShareAlbum(id, modifyShareAlbumRequest);
      return response.data;
    } catch (error) {
      throw this.errorHandler(error);
    }
  }

  /**
   * 공유앨범 초대코드 생성
   */
  async createInviteCode(id: string) {
    try {
      const response = await this.socialClient.shareAlbumControllerCreateShareAlbumInviteCode(id);
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
