export interface CreateShareAlbumParams {
  /** 공유앨범 명 */
  name: string;

  /** 공유앨범 설명 */
  bio?: string;

  /** 공유앨범 생성자의 ID */
  ownerId: number;
}
export interface GetShareAlbumParams {
  /** 공유앨범 ID */
  id: string;

  /** 앨범을 조회하는 유저 ID */
  userId: number;
}

export interface ModifyShareAlbumParams {
  /** 공유앨범 ID */
  id: string;

  /** 앨범을 수정하는 유저 ID */
  userId: number;

  /** 공유앨범 명 */
  name?: string;

  /** 공유앨범 설명 */
  bio?: string;
}
