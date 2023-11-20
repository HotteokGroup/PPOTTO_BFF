export interface CreateFeedParams {
  /** 공유앨범 ID */
  shareAlbumId: string;

  /** 유저 ID */
  userId: number;

  /** 피드 내용 */
  description: string;

  /** 피드 콘텐츠 */
  contents: Express.Multer.File[];
}
