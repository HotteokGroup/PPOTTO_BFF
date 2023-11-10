import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmVerificationRequest {
  @ApiProperty({ description: '인증 요청 아이디', example: '123h12hj3j1' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: '인증 코드', example: '123456' })
  @IsNotEmpty()
  verificationCode: string;
}

@Exclude()
export class ConfirmVerificationResponse {
  @Expose()
  @ApiProperty({ description: '인증 요청 결과 아이디', example: '123h12hj3j1' })
  id: string;

  @Expose()
  @ApiProperty({ description: '인증 결과', example: true })
  result: boolean;

  @Expose()
  @ApiProperty({ description: '남은 인증가능 횟수', example: 5 })
  remaining: number;

  @Expose()
  @ApiProperty({
    description: 'accessToken',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjJ9.tbDepxpstvGdW8TC3G8zg4B6rUYAOvfzdceoH48wgRQ',
  })
  accessToken?: string;
}
