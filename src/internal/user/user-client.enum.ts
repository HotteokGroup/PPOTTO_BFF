import { SendVerificationRequestVerificationTypeEnum } from '@ppotto/user-api-client';

export const VerificationType = SendVerificationRequestVerificationTypeEnum;
export type VerificationType = (typeof VerificationType)[keyof typeof VerificationType];
