import { Injectable } from '@nestjs/common';

import { SendVerificationRequest, SendVerificationResponse } from './dto/send-verification.dto';
import { UserApiClientService } from '../internal/user/user-api-client.service';

@Injectable()
export class AuthService {
  constructor(private readonly userApi: UserApiClientService) {}

  async sendVerification(params: SendVerificationRequest): Promise<SendVerificationResponse> {
    const { id } = await this.userApi.sendVerification(params);

    return { id };
  }
}
