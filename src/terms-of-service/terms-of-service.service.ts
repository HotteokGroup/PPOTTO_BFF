import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { TermsOfServiceAgreeParams } from './terms-of-service.interface';
import { TermsOfServiceClient } from '../internal/user-client/terms-of-service/terms-of-service.client';
import { UserClient } from '../internal/user-client/user/user.client';
import { UserClientException } from '../internal/user-client/user-client.exception';
import { ERROR_CODE } from '../lib/exception/error.constant';

@Injectable()
export class TermsOfServiceService {
  constructor(
    private readonly termsOfServiceClient: TermsOfServiceClient,
    private readonly userClient: UserClient,
  ) {}

  /**
   * 약관 리스트 가져오기
   */
  async getList() {
    try {
      const { list } = await this.termsOfServiceClient.getList();

      return { list };
    } catch (error) {
      throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 약관 동의하기
   */
  async agree(params: TermsOfServiceAgreeParams) {
    const user = await this.userClient.getInfo(params.userId).catch((error) => {
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
    });

    // 이미 동의한 약관 정보 조회
    const alreadyAgreedTerms = new Set(user.UserTermsOfServiceAgreement.map((agreement) => agreement.termsOfServiceId));

    // 이미 동의한 약관 ID를 제외한 약관 ID로 요청
    const termsOfServiceIds = params.termsOfServiceIds.filter(
      (termsOfServiceId) => !alreadyAgreedTerms.has(termsOfServiceId),
    );

    // 동의할 약관 ID가 없는 경우
    if (!termsOfServiceIds.length) {
      throw new BadRequestException(ERROR_CODE.TERMS_OF_SERVICE_ALREADY_AGREE);
    }

    await this.termsOfServiceClient.agree({ userId: params.userId, termsOfServiceIds }).catch((error) => {
      if (!(error instanceof UserClientException)) {
        throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }

      const errorInfo = error.getResponse();
      switch (errorInfo.errorCode) {
        case 'USER_NOT_FOUND':
          throw new NotFoundException(ERROR_CODE.USER_NOT_FOUND);
        case 'TERMS_OF_SERVICE_NOT_FOUND':
          throw new NotFoundException(ERROR_CODE.TERMS_OF_SERVICE_NOT_FOUND);
        default:
          throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }
    });
  }
}
