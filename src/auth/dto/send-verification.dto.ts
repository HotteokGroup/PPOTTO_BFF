import { ApiProperty } from '@nestjs/swagger';
import { SendVerificationRequestVerificationTypeEnum } from '@ppotto/user-api-client';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, ValidateIf } from 'class-validator';

export class SendVerificationRequest {
  @ApiProperty({ description: '인증 타입', example: SendVerificationRequestVerificationTypeEnum.Email })
  @IsEnum(SendVerificationRequestVerificationTypeEnum)
  @IsNotEmpty()
  verificationType: SendVerificationRequestVerificationTypeEnum;

  @ApiProperty({ description: '이메일 주소 (인증 타입이 이메일인 경우 필수)', example: 'test@naver.com' })
  @ValidateIf((o) => o.verificationType === SendVerificationRequestVerificationTypeEnum.Email)
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
    description: 'id',
  })
  id: string;
}
