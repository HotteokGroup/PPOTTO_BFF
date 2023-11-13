export interface SignUpFromEmailParams {
  /** 이메일 */
  email: string;

  /** 이름 */
  nickname: string;

  /** 비밀번호 (평문) */
  password: string;
}

export interface LoginByEmailParams {
  /** 이메일 */
  email: string;

  /** 비밀번호 (평문) */
  password: string;
}
