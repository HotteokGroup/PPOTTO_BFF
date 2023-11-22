import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { GetUserInfoResponse } from './dto/get-user-info.dto';
import { LoginByEmailRequest, LoginByEmailResponse } from './dto/login-by-email.dto';
import { SignUpFromEmailRequest, SignUpFromEmailResponse } from './dto/signup-from-email.dto';
import { UserService } from './user.service';
import { ERROR_CODE, GenerateSwaggerDocumentByErrorCode } from '../lib/exception/error.constant';
import { UserInfo } from '../lib/jwt/decorators/auth-jwt.decorator';
import { TemporaryUserAuth } from '../lib/jwt/decorators/temporary-jwt.decorator';
import { AuthJwtGuard } from '../lib/jwt/guards/auth-jwt.guard';
import { TemporaryJwtGuard } from '../lib/jwt/guards/temporary-jwt.guard';
import { AuthJwtPayload, TemporaryJwtPayload } from '../lib/jwt/jwt-utility.interface';

@Controller()
@ApiTags('유저')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '회원가입',
    description: '회원가입을 요청합니다. (temporary-jwt가 필요합니다.)',
  })
  @GenerateSwaggerDocumentByErrorCode([
    ERROR_CODE.INTERNAL_SERVER_ERROR,
    ERROR_CODE.INVALID_DATA,
    ERROR_CODE.USER_ALREADY_EXISTS,
  ])
  @ApiBearerAuth('temporary-jwt')
  @UseGuards(TemporaryJwtGuard)
  @Post('signup')
  async signUpFromEmail(@TemporaryUserAuth() temporaryUser: TemporaryJwtPayload, @Body() data: SignUpFromEmailRequest) {
    return plainToInstance(
      SignUpFromEmailResponse,
      await this.userService.signUpFromEmail({
        email: temporaryUser.email,
        nickname: data.nickname,
        password: data.password,
      }),
    );
  }

  @ApiOperation({
    summary: '이메일 로그인',
    description: '이메일과 비밀번호로 로그인합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([
    ERROR_CODE.INTERNAL_SERVER_ERROR,
    ERROR_CODE.INVALID_DATA,
    ERROR_CODE.USER_NOT_FOUND,
  ])
  @Post('login-by-email')
  async loginByEmail(@Body() data: LoginByEmailRequest) {
    return plainToInstance(LoginByEmailResponse, await this.userService.loginByEmail(data));
  }

  @ApiOperation({
    summary: '유저 정보 & 약관 동의 정보 조회',
    description: '유저 정보 & 약관 동의 정보를 조회합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([
    ERROR_CODE.INTERNAL_SERVER_ERROR,
    ERROR_CODE.INVALID_DATA,
    ERROR_CODE.USER_NOT_FOUND,
  ])
  @ApiBearerAuth('jwt')
  @UseGuards(AuthJwtGuard)
  @Get('user')
  async getUserInfo(@UserInfo() user: AuthJwtPayload) {
    return plainToInstance(GetUserInfoResponse, await this.userService.getInfo(user.id));
  }
}
