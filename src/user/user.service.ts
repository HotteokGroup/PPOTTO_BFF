import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { SignUpFromEmailParams } from './user.interface';
import { UserClientException } from '../internal/user/user-client.exception';
import { UserClientService } from '../internal/user/user-client.service';
import { ERROR_CODE } from '../lib/exception/error.constant';
import { JwtUtilityService } from '../lib/jwt/jwt-utility.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userClient: UserClientService,
    private readonly jwtService: JwtUtilityService,
  ) {}

  async signUpFromEmail(params: SignUpFromEmailParams) {
    try {
      const { email, nickname, password } = params;
      const { id } = await this.userClient.createUser({ email, nickName: nickname, password });
      const accessToken = await this.jwtService.generateAuthToken({ id });

      return { accessToken };
    } catch (error) {
      if (!(error instanceof UserClientException)) {
        throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }

      const errorInfo = error.getResponse();
      switch (errorInfo.errorCode) {
        case 'USER_ALREADY_EXISTS':
          throw new BadRequestException(ERROR_CODE.USER_ALREADY_EXISTS);
        default:
          throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
