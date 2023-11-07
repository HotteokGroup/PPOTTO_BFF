import { Injectable } from '@nestjs/common';
import {
  DefaultApi as UserApiClient,
  SendVerificationRequest,
  SendVerificationResponse,
} from '@ppotto/user-api-client';

@Injectable()
export class UserApiClientService {
  constructor(private readonly userApiClient: UserApiClient) {}

  async sendVerification(sendVerificationRequest: SendVerificationRequest): Promise<SendVerificationResponse> {
    const response = await this.userApiClient.verificationControllerSendVerification(sendVerificationRequest);

    return response.data;
  }
}
