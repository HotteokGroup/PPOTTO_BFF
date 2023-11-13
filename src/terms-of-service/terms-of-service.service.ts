import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { UserClientException } from '../internal/user/user-client.exception';
import { UserClientService } from '../internal/user/user-client.service';
import { ERROR_CODE } from '../lib/exception/error.constant';

@Injectable()
export class TermsOfServiceService {
  constructor(private readonly userClient: UserClientService) {}

  async getTermsOfServiceList() {
    try {
      const { list } = await this.userClient.getTermsOfServiceList();

      return { list };
    } catch (error) {
      if (!(error instanceof UserClientException)) {
        throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }

      throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
    }
  }
}
