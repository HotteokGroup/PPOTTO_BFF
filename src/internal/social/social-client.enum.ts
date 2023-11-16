import { GetSharedAlbumMemberItemRoleEnum } from '@ppotto/social-api-client';

export const ShareAlbumMemberRole = GetSharedAlbumMemberItemRoleEnum;
export type ShareAlbumMemberRole = (typeof ShareAlbumMemberRole)[keyof typeof ShareAlbumMemberRole];

export const shareAlbumMemberRoleLevels = {
  [ShareAlbumMemberRole.Temporary]: 0,
  [ShareAlbumMemberRole.Viewer]: 1,
  [ShareAlbumMemberRole.Editor]: 2,
  [ShareAlbumMemberRole.Owner]: 3,
};
