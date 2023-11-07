import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserApiClientModule } from '../internal/user/user-api-client.module';
import { JwtUtilityModule } from '../lib/jwt/jwt-utility.module';

@Module({
  imports: [JwtUtilityModule, UserApiClientModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
