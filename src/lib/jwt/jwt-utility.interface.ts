export interface AuthJwtPayload {
  /** User ID */
  id: string;
}

export interface TemporaryJwtPayload {
  /** 인증 ID */
  id: string;

  /** 회원 이메일 */
  email: string;
}
