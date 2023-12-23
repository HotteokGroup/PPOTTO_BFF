export interface AwsS3ServiceGetFileOptions {
  /** 버킷 이름 */
  bucket: string;

  /** 파일 위치 */
  key: string;
}

export interface AwsS3ServiceSaveOptions {
  /** 버킷 이름 */
  bucket: string;

  /** 저장할 위치 */
  key: string;

  /** 저장할 파일 */
  file: Buffer;
}

export interface UploadImagesParams {
  /** 버킷 이름 */
  bucket: string;

  /** 업로드할 이미지들 */
  imageUploads: {
    /** 저장할 위치 */
    key: string;

    /** 저장할 파일 */
    file: Buffer;
  }[];
}
