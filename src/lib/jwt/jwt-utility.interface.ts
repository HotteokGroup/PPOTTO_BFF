export interface AuthJwtPayload {
  /** User ID */
  id: number;
}

export interface TemporaryJwtPayload {
  /** 인증 ID */
  id: string;

  /** 회원 이메일 */
  email: string;
}
