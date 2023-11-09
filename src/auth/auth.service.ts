import { Injectable } from '@nestjs/common';
import { ConfirmVerificationResponseVerificationTypeEnum } from '@ppotto/user-api-client';

import { ConfirmVerificationRequest, ConfirmVerificationResponse } from './dto/confirm-verification.dto';
import { SendVerificationRequest, SendVerificationResponse } from './dto/send-verification.dto';
import { UserApiClientService } from '../internal/user/user-api-client.service';
import { JwtUtilityService } from '../lib/jwt/jwt-utility.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userApi: UserApiClientService,
    private readonly jwtService: JwtUtilityService,
  ) {}

  async sendVerification(params: SendVerificationRequest): Promise<SendVerificationResponse> {
    const { id } = await this.userApi.sendVerification(params);

    return { id };
  }

  async confirmVerification(params: ConfirmVerificationRequest): Promise<ConfirmVerificationResponse> {
    const { id, result, remaining, emailAddress, verificationType } = await this.userApi.confirmVerification(params);

    // 인증 성공 시 회원가입 용 임시 JWT 발급
    let accessToken;
    if (
      result &&
      verificationType === ConfirmVerificationResponseVerificationTypeEnum.Email &&
      emailAddress !== undefined
    ) {
      accessToken = await this.jwtService.generateTemporaryToken({
        id,
        email: emailAddress,
      });
    }
    return {
      id,
      result,
      remaining,
      accessToken,
    };
  }
}
