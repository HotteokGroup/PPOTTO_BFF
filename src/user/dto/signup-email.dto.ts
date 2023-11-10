import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

export class SignUpFromEmailRequest {
  @ApiProperty({
    description: '닉네임',
    example: '용감한딸기',
  })
  @IsString()
  @Length(4, 10)
  @Matches(/^[A-Za-z0-9가-힣]*$/, {
    message: '닉네임은 특수문자, 띄어쓰기, 이모지를 포함할 수 없습니다.',
  })
  nickname: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'test1234',
  })
  @IsString()
  @Length(8, 20)
  @Matches(/^(?:(?=.*[A-Z])|(?=.*[a-z])|(?=.*[^A-Za-z0-9]))(?=.*\d).+$/, {
    message: '비밀번호는 알파벳 대문자, 소문자, 특수문자 중 1가지와 숫자를 조합해야 합니다.',
  })
  password: string;
}

@Exclude()
export class SignUpFromEmailResponse {
  @Expose()
  @ApiProperty({
    description: 'accessToken',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTYyMzkwMjJ9.tbDepxpstvGdW8TC3G8zg4B6rUYAOvfzdceoH48wgRQ',
  })
  accessToken: string;
}
