export interface CreateShareAlbumParams {
  /** 공유앨범 명 */
  name: string;

  /** 공유앨범 설명 */
  bio: string;

  /** 공유앨범 생성자의 ID */
  ownerId: number;
}
export interface GetSharedAlbumParams {
  /** 공유앨범 ID */
  id: string;

  /** 앨범을 조회하는 유저 ID */
  userId: number;
}
