import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetSharedAlbumMemberItem } from '@ppotto/social-api-client';

import {
  CreateInviteCodeParams,
  CreateShareAlbumParams,
  GetShareAlbumParams,
  JoinByInviteCodeParams,
  ModifyShareAlbumParams,
} from './share-album.interface';
import { ShareAlbumClient } from '../internal/social-client/share-album/share-album.client';
import { ShareAlbumMemberRole } from '../internal/social-client/share-album/share-album.enum';
import { SocialClientException } from '../internal/social-client/social-client.exception';
import { ERROR_CODE } from '../lib/exception/error.constant';

@Injectable()
export class ShareAlbumService {
  constructor(private readonly shareAlbumClient: ShareAlbumClient) {}

  /**
   * 공유앨범 생성
   */
  async create(params: CreateShareAlbumParams) {
    try {
      const { id } = await this.shareAlbumClient.create(params);

      return { id };
    } catch (error) {
      throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 공유앨범 조회 및 권한 확인
   */
  async get(params: GetShareAlbumParams) {
    const { id, userId } = params;
    const shareAlbum = await this.find(id);

    if (!this.canUserView(shareAlbum.shareAlbumMemberList, userId)) {
      throw new ForbiddenException(ERROR_CODE.SHARE_ALBUM_INSUFFICIENT_PERMISSION);
    }

    return {
      id: shareAlbum.id,
      name: shareAlbum.name,
      bio: shareAlbum.bio,
    };
  }

  /**
   * 공유앨범 조회
   */
  private async find(id: string) {
    try {
      const shareAlbum = await this.shareAlbumClient.get(id);

      return shareAlbum;
    } catch (error) {
      if (!(error instanceof SocialClientException)) {
        throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }

      const errorInfo = error.getResponse();
      switch (errorInfo.errorCode) {
        case 'SHARE_ALBUM_NOT_FOUND':
          throw new NotFoundException(ERROR_CODE.SHARE_ALBUM_NOT_FOUND);
        default:
          throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }
    }
  }

  /**
   * 공유앨범 수정
   */
  async modify(params: ModifyShareAlbumParams) {
    const { id, userId, name, bio } = params;
    const shareAlbum = await this.find(id);

    if (!this.canUserModify(shareAlbum.shareAlbumMemberList, userId)) {
      throw new ForbiddenException(ERROR_CODE.SHARE_ALBUM_INSUFFICIENT_PERMISSION);
    }

    const shareAlbumId = await this.shareAlbumClient.modify(id, { name, bio }).catch(() => {
      throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
    });

    return {
      id: shareAlbumId,
    };
  }

  /**
   * 공유앨범 초대코드 생성
   */
  async createInviteCode(params: CreateInviteCodeParams) {
    const { id, userId } = params;
    const shareAlbum = await this.find(id);

    if (!this.canUserCreateInviteCode(shareAlbum.shareAlbumMemberList, userId)) {
      throw new ForbiddenException(ERROR_CODE.SHARE_ALBUM_INSUFFICIENT_PERMISSION);
    }

    try {
      const { inviteCode } = await this.shareAlbumClient.createInviteCode(id);

      return {
        inviteCode,
      };
    } catch (error) {
      if (!(error instanceof SocialClientException)) {
        throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }

      const errorInfo = error.getResponse();
      switch (errorInfo.errorCode) {
        case 'SHARE_ALBUM_NOT_FOUND':
          throw new NotFoundException(ERROR_CODE.SHARE_ALBUM_NOT_FOUND);
        default:
          throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }
    }
  }

  /**
   * 초대코드로 공유앨범에 가입합니다.
   */
  async joinByInviteCode(params: JoinByInviteCodeParams) {
    const { userId, code } = params;

    try {
      const { shareAlbumId } = await this.shareAlbumClient.joinByInviteCode(code, {
        userId,
      });

      return {
        shareAlbumId,
      };
    } catch (error) {
      if (!(error instanceof SocialClientException)) {
        throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }

      const errorInfo = error.getResponse();
      switch (errorInfo.errorCode) {
        case 'SHARE_ALBUM_INVITE_CODE_NOT_FOUND':
          throw new NotFoundException(ERROR_CODE.SHARE_ALBUM_INVITE_CODE_NOT_FOUND);
        case 'SHARE_ALBUM_MEMBER_ALREADY_JOINED':
          throw new BadRequestException(ERROR_CODE.SHARE_ALBUM_MEMBER_ALREADY_JOINED);
        default:
          throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }
    }
  }

  private canUserView(shareAlbumMembers: GetSharedAlbumMemberItem[], userId: number): boolean {
    const viewerRoleLevel = ShareAlbumMemberRole.VIEWER;
    return this.canUserPerformAction(shareAlbumMembers, userId, viewerRoleLevel);
  }

  private canUserModify(shareAlbumMembers: GetSharedAlbumMemberItem[], userId: number): boolean {
    const ownerRoleLevel = ShareAlbumMemberRole.OWNER;
    return this.canUserPerformAction(shareAlbumMembers, userId, ownerRoleLevel);
  }

  private canUserCreateInviteCode(shareAlbumMembers: GetSharedAlbumMemberItem[], userId: number): boolean {
    const ownerRoleLevel = ShareAlbumMemberRole.OWNER;
    return this.canUserPerformAction(shareAlbumMembers, userId, ownerRoleLevel);
  }

  private canUserPerformAction(
    shareAlbumMembers: GetSharedAlbumMemberItem[],
    userId: number,
    requiredRoleLevel: number,
  ): boolean {
    const member = shareAlbumMembers.find((shareAlbumMember) => shareAlbumMember.userId === userId);

    // 앨범 그룹원이 아닌 경우 작업 불가능
    if (!member) return false;

    const userRoleLevel = ShareAlbumMemberRole[member.role];
    return userRoleLevel >= requiredRoleLevel;
  }
}
