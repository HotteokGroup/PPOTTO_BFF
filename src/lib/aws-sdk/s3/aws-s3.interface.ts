export interface ResizeImageToWebpOptions {
  /** Buffer 이미지 */
  image: Buffer;

  /** 너비 */
  width: number;

  /** 높이 */
  height?: number;
}

export interface GetFileFromS3Options {
  /** 버킷 이름 */
  bucket: string;

  /** 파일 위치 */
  key: string;
}

export interface SaveFileToS3Options {
  /** 버킷 이름 */
  bucket: string;

  /** 저장할 위치 */
  key: string;

  /** 저장할 파일 */
  file: Buffer;
}
