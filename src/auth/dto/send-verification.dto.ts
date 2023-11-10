import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateIf } from 'class-validator';

import { VerificationType } from '../../internal/user/user-client.enum';

export class SendVerificationRequest {
  @ApiProperty({ description: '인증 타입', example: VerificationType.Email, enum: VerificationType })
  @IsEnum(VerificationType)
  @IsNotEmpty()
  verificationType: VerificationType;

  @ApiProperty({ description: '이메일 주소 (인증 타입이 이메일인 경우 필수)', example: 'test@naver.com' })
  @ValidateIf((o) => o.verificationType === VerificationType.Email)
  @IsEmail()
  @IsOptional()
  emailAddress?: string;

  @ApiProperty({ description: '요청 유저 아이디 (단순 기록용)', example: 1 })
  @IsNumber()
  @IsOptional()
  userId?: number;
}

@Exclude()
export class SendVerificationResponse {
  @Expose()
  @ApiProperty({
    description: '인증 요청 결과 아이디',
  })
  id: string;
}
