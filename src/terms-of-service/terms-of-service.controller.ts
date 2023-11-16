import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AgreeTermsOfServiceRequest } from './dto/agree-terms-of-service.dto';
import { GetTermsOfServiceResponse } from './dto/get-terms-of-service.dto';
import { TermsOfServiceService } from './terms-of-service.service';
import { ERROR_CODE, GenerateSwaggerDocumentByErrorCode } from '../lib/exception/error.constant';
import { UserInfo } from '../lib/jwt/decorators/auth-jwt.decorator';
import { AuthJwtGuard } from '../lib/jwt/guards/auth-jwt.guard';
import { AuthJwtPayload } from '../lib/jwt/jwt-utility.interface';

@Controller('terms-of-service')
@ApiTags('약관')
export class TermsOfServiceController {
  constructor(private readonly termsOfServiceService: TermsOfServiceService) {}

  @ApiOperation({
    summary: '약관 리스트',
    description: '약관 리스트를 조회합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([ERROR_CODE.INTERNAL_SERVER_ERROR, ERROR_CODE.INVALID_DATA])
  @Get()
  async getTermsOfServiceList() {
    return plainToInstance(GetTermsOfServiceResponse, await this.termsOfServiceService.getTermsOfServiceList());
  }

  @ApiOperation({
    summary: '약관 동의',
    description: '약관을 동의합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([
    ERROR_CODE.INTERNAL_SERVER_ERROR,
    ERROR_CODE.INVALID_DATA,
    ERROR_CODE.TERMS_OF_SERVICE_ALREADY_AGREE,
    ERROR_CODE.TERMS_OF_SERVICE_NOT_FOUND,
    ERROR_CODE.USER_NOT_FOUND,
  ])
  @ApiBearerAuth('jwt')
  @UseGuards(AuthJwtGuard)
  @Post('/agree')
  async agreeTermsOfService(@UserInfo() user: AuthJwtPayload, @Body() data: AgreeTermsOfServiceRequest) {
    await this.termsOfServiceService.agreeTermsOfService({
      userId: user.id,
      termsOfServiceIds: data.termsOfServiceIds,
    });
  }
}
