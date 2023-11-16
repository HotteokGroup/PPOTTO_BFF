import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { GetSharedAlbumMemberItem } from '@ppotto/social-api-client';

import { CreateShareAlbumParams, GetSharedAlbumParams } from './share-album.interface';
import { ShareAlbumMemberRole, shareAlbumMemberRoleLevels } from '../internal/social/social-client.enum';
import { SocialClientException } from '../internal/social/social-client.exception';
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

  async getSharedAlbum(params: GetSharedAlbumParams) {
    const { id, userId } = params;
    const sharedAlbum = await this.socialClient.getSharedAlbum(id).catch((error) => {
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
    });

    if (!this.canUserViewShareAlbum(sharedAlbum.shareAlbumMemberList, userId)) {
      throw new ForbiddenException(ERROR_CODE.SHARE_ALBUM_INSUFFICIENT_PERMISSION);
    }

    return {
      id: sharedAlbum.id,
      name: sharedAlbum.name,
      bio: sharedAlbum.bio,
    };
  }

  private canUserViewShareAlbum(shareAlbumMembers: GetSharedAlbumMemberItem[], userId: number): boolean {
    const member = shareAlbumMembers.find((shareAlbumMember) => shareAlbumMember.userId === userId);

    // 앨범 그룹원이 아닌 경우 조회 불가능
    if (!member) return false;

    const userRoleLevel = shareAlbumMemberRoleLevels[member.role];
    const viewerRoleLevel = shareAlbumMemberRoleLevels[ShareAlbumMemberRole.Viewer];
    return userRoleLevel >= viewerRoleLevel;
  }
}
