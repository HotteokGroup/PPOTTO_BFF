import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { GetTermsOfServiceResponse } from './dto/get-terms-of-service';
import { TermsOfServiceService } from './terms-of-service.service';
import { ERROR_CODE, GenerateSwaggerDocumentByErrorCode } from '../lib/exception/error.constant';

@Controller('terms-of-service')
@ApiTags('약관')
export class TermsOfServiceController {
  constructor(private readonly termsOfServiceService: TermsOfServiceService) {}

  @ApiOperation({
    summary: '약관 리스트',
    description: '약관 리스트를 조회합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([ERROR_CODE.INTERNAL_SERVER_ERROR])
  @Get()
  async getTermsOfServiceList() {
    return plainToInstance(GetTermsOfServiceResponse, await this.termsOfServiceService.getTermsOfServiceList());
  }
}
