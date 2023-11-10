import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserClientModule } from '../internal/user/user-client.module';
import { JwtUtilityModule } from '../lib/jwt/jwt-utility.module';

@Module({
  imports: [UserClientModule, JwtUtilityModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
