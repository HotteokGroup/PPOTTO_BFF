import { Injectable } from '@nestjs/common';
import {
  CreateShareAlbumRequest,
  DefaultApi as SocialApiClient,
  JoinShareAlbumByInviteCodeRequest,
  ModifyShareAlbumRequest,
} from '@ppotto/social-api-client';
import { AxiosError } from 'axios';

import { ERROR_CODE } from '../../../lib/exception/error.constant';
import { SocialClientException } from '../social-client.exception';

@Injectable()
export class ShareAlbumClient {
  constructor(private readonly socialApiClient: SocialApiClient) {}

  /**
   * 공유앨범 생성
   */
  async create(createShareAlbumRequest: CreateShareAlbumRequest) {
    try {
      const response = await this.socialApiClient.shareAlbumControllerCreateShareAlbum(createShareAlbumRequest);
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
      const response = await this.socialApiClient.shareAlbumControllerGetShareAlbum(id);
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
      const response = await this.socialApiClient.shareAlbumControllerModifyShareAlbum(id, modifyShareAlbumRequest);
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
      const response = await this.socialApiClient.shareAlbumControllerCreateShareAlbumInviteCode(id);
      return response.data;
    } catch (error) {
      throw this.errorHandler(error);
    }
  }

  /**
   * 초대코드로 공유앨범 가입
   */
  async joinByInviteCode(code: string, joinShareAlbumByInviteCodeRequest: JoinShareAlbumByInviteCodeRequest) {
    try {
      const response = await this.socialApiClient.shareAlbumControllerJoinShareAlbumByInviteCode(
        code,
        joinShareAlbumByInviteCodeRequest,
      );
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
