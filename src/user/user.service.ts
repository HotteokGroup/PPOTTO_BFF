import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { LoginByEmailParams, SignUpFromEmailParams } from './user.interface';
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

  async loginByEmail(params: LoginByEmailParams) {
    try {
      const { id } = await this.userClient.loginByEmail(params);
      const accessToken = await this.jwtService.generateAuthToken({ id });

      return { accessToken };
    } catch (error) {
      if (!(error instanceof UserClientException)) {
        throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }

      const errorInfo = error.getResponse();
      switch (errorInfo.errorCode) {
        case 'USER_NOT_FOUND':
          throw new BadRequestException(ERROR_CODE.USER_NOT_FOUND);
        default:
          throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async getUserInfo(userId: number) {
    const user = await this.userClient.getUserInfo(userId).catch((error) => {
      if (!(error instanceof UserClientException)) {
        throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }

      const errorInfo = error.getResponse();
      switch (errorInfo.errorCode) {
        case 'USER_NOT_FOUND':
          throw new BadRequestException(ERROR_CODE.USER_NOT_FOUND);
        default:
          throw new InternalServerErrorException(ERROR_CODE.INTERNAL_SERVER_ERROR);
      }
    });

    if (!user) {
      throw new BadRequestException(ERROR_CODE.USER_NOT_FOUND);
    }

    if (user.deletedAt) {
      throw new ForbiddenException(ERROR_CODE.USER_WITHDRAWAL);
    }

    return user;
  }
}
