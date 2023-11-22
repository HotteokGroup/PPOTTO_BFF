import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfirmVerificationResponseVerificationTypeEnum } from '@ppotto/user-api-client';

import { ConfirmVerificationRequest, ConfirmVerificationResponse } from './dto/confirm-verification.dto';
import { SendVerificationRequest, SendVerificationResponse } from './dto/send-verification.dto';
import { UserClientException } from '../internal/user-client/user-client.exception';
import { VerificationClient } from '../internal/user-client/verification/verification.client';
import { ERROR_CODE } from '../lib/exception/error.constant';
import { JwtUtilityService } from '../lib/jwt/jwt-utility.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly verificationClient: VerificationClient,
    private readonly jwtService: JwtUtilityService,
  ) {}

  /**
   * 인증 요청
   */
  async sendVerification(params: SendVerificationRequest): Promise<SendVerificationResponse> {
    try {
      const { id } = await this.verificationClient.sendVerification(params);

      return { id };
    } catch (error) {
      if (!(error instanceof UserClientException)) {
        throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }

      const errorInfo = error.getResponse();
      switch (errorInfo.errorCode) {
        case 'USER_NOT_FOUND':
          throw new NotFoundException(ERROR_CODE.USER_NOT_FOUND);
        default:
          throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }
    }
  }

  /**
   * 인증 확인
   */
  async confirmVerification(params: ConfirmVerificationRequest): Promise<ConfirmVerificationResponse> {
    try {
      const verification = await this.verificationClient.confirmVerification(params);
      const { id, result, remaining, emailAddress, verificationType } = verification;

      // 인증 실패 시
      if (!result) {
        return {
          id,
          result,
          remaining,
        };
      }

      // 인증 성공 시 회원가입 용 임시 JWT 발급
      let accessToken;
      // 이메일 인증인 경우 JWT payload에 이메일 정보 추가
      if (verificationType === ConfirmVerificationResponseVerificationTypeEnum.Email && emailAddress !== undefined) {
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
    } catch (error) {
      if (!(error instanceof UserClientException)) {
        throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }

      const errorInfo = error.getResponse();
      switch (errorInfo.errorCode) {
        case 'VERIFICATION_EXCEED_MAXIMUM_COUNT':
          throw new BadRequestException(ERROR_CODE.VERIFICATION_EXCEED_MAXIMUM_COUNT);
        case 'VERIFICATION_EXPIRED':
          throw new BadRequestException(ERROR_CODE.VERIFICATION_EXPIRED);
        case 'VERIFICATION_ALREADY_VERIFIED':
          throw new BadRequestException(ERROR_CODE.VERIFICATION_ALREADY_VERIFIED);
        default:
          throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
