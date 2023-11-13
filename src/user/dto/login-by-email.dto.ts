import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginByEmailRequest {
  @ApiProperty({
    description: '이메일',
    example: 'test@mail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'test1234',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

@Exclude()
export class LoginByEmailResponse {
  @Expose()
  @ApiProperty({
    description: 'accessToken',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjJ9.tbDepxpstvGdW8TC3G8zg4B6rUYAOvfzdceoH48wgRQ',
  })
  accessToken: string;
}
