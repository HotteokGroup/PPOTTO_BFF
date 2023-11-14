import { Module } from '@nestjs/common';

import { TermsOfServiceController } from './terms-of-service.controller';
import { TermsOfServiceService } from './terms-of-service.service';
import { UserClientModule } from '../internal/user/user-client.module';
import { JwtUtilityModule } from '../lib/jwt/jwt-utility.module';

@Module({
  imports: [UserClientModule, JwtUtilityModule],
  providers: [TermsOfServiceService],
  controllers: [TermsOfServiceController],
})
export class TermsOfServiceModule {}
