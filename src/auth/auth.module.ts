import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserClientModule } from '../internal/user/user-client.module';
import { JwtUtilityModule } from '../lib/jwt/jwt-utility.module';

@Module({
  imports: [JwtUtilityModule, UserClientModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
