import { FeedContentType } from '../internal/social-client/feed/feed.enum';

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

export interface FeedContent {
  /** 콘텐츠 ID */
  userFileStoreId: string;

  /** 콘텐츠 타입 */
  type: FeedContentType;

  /** 콘텐츠 URL */
  contentSmallUrl: string;

  /** 콘텐츠 URL */
  contentMediumUrl: string;

  /** 콘텐츠 URL */
  contentLargeUrl: string;
}

export interface CreateFeedContentParams {
  /** 콘텐츠 */
  content: Express.Multer.File;

  /** 유저 ID */
  userId: number;

  /** 공유앨범 ID */
  shareAlbumId: string;

  /** 피드 ID */
  feedId: string;
}

export interface FeedContentFileUrls {
  originalFileUrl: string;
  smallThumbnailUrl: string;
  mediumThumbnailUrl: string;
  largeThumbnailUrl: string;
}
