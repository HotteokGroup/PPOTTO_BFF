export interface CreateShareAlbumParams {
  /** 공유앨범 명 */
  name: string;

  /** 공유앨범 설명 */
  bio: string;

  /** 공유앨범 생성자의 ID */
  ownerId: number;
}
