import { FeedContentType } from '../internal/social-client/feed/feed.enum';

export interface CreateFeedParams {
  /** 공유앨범 ID */
  shareAlbumId: string;

  /** 유저 ID */
  userId: number;

  /** 피드 내용 */
  description: string;

  /** 피드 콘텐츠 */
  contents: CreateFeedItem[];
}

export interface CreateFeedItem {
  /** 콘텐츠 ID */
  contentId: string;

  /** 콘텐츠 타입 */
  type: FeedContentType;

  /** 콘텐츠 URL */
  contentSmallUrl?: string;

  /** 콘텐츠 URL */
  contentMediumUrl?: string;

  /** 콘텐츠 URL */
  contentLargeUrl?: string;
}
