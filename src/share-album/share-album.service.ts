import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GetSharedAlbumMemberItem } from '@ppotto/social-api-client';

import { CreateShareAlbumParams, GetShareAlbumParams, ModifyShareAlbumParams } from './share-album.interface';
import { ShareAlbumClient } from '../internal/social/share-album/share-album.client';
import { ShareAlbumMemberRole } from '../internal/social/share-album/share-album.enum';
import { SocialClientException } from '../internal/social/social.exception';
import { ERROR_CODE } from '../lib/exception/error.constant';

@Injectable()
export class ShareAlbumService {
  constructor(private readonly shareAlbumClient: ShareAlbumClient) {}

  async createShareAlbum(params: CreateShareAlbumParams) {
    try {
      const { id } = await this.shareAlbumClient.create(params);

      return { id };
    } catch (error) {
      throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async getShareAlbum(params: GetShareAlbumParams) {
    const { id, userId } = params;
    const shareAlbum = await this.findShareAlbum(id);

    if (!this.canUserViewShareAlbum(shareAlbum.shareAlbumMemberList, userId)) {
      throw new ForbiddenException(ERROR_CODE.SHARE_ALBUM_INSUFFICIENT_PERMISSION);
    }

    return {
      id: shareAlbum.id,
      name: shareAlbum.name,
      bio: shareAlbum.bio,
    };
  }

  private async findShareAlbum(id: string) {
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

  async modifyShareAlbum(params: ModifyShareAlbumParams) {
    const { id, userId, name, bio } = params;
    const shareAlbum = await this.findShareAlbum(id);

    if (!this.canUserModifyShareAlbum(shareAlbum.shareAlbumMemberList, userId)) {
      throw new ForbiddenException(ERROR_CODE.SHARE_ALBUM_INSUFFICIENT_PERMISSION);
    }

    const shareAlbumId = await this.shareAlbumClient.modify(id, { name, bio }).catch(() => {
      throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
    });

    return {
      id: shareAlbumId,
    };
  }

  private canUserViewShareAlbum(shareAlbumMembers: GetSharedAlbumMemberItem[], userId: number): boolean {
    const viewerRoleLevel = ShareAlbumMemberRole.VIEWER;
    return this.canUserPerformAction(shareAlbumMembers, userId, viewerRoleLevel);
  }

  private canUserModifyShareAlbum(shareAlbumMembers: GetSharedAlbumMemberItem[], userId: number): boolean {
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
