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

export interface CreateInviteCodeParams {
  /** 공유앨범 ID */
  id: string;

  /** 초대코드를 생성하려는 유저 ID */
  userId: number;
}

export interface JoinByInviteCodeParams {
  /** 공유앨범에 가입하려는 유저 ID */
  userId: number;

  /** 초대코드 */
  code: string;
}
