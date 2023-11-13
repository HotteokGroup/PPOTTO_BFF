import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class GetTermsOfServiceItem {
  @Expose()
  @ApiProperty({ description: '약관 아이디', example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ description: '약관 제목', example: '서비스 이용 약관' })
  title: string;

  @Expose()
  @ApiProperty({ description: '약관 내용', example: '약관 내용' })
  content: string;

  @Expose()
  @ApiProperty({ description: '필수 여부', example: true })
  isEssential: boolean;

  @Expose()
  @ApiProperty({ description: '생성일', example: '2021-01-01T00:00:00.000Z' })
  createdAt: Date;
}

@Exclude()
export class GetTermsOfServiceResponse {
  @Expose()
  @Type(() => GetTermsOfServiceItem)
  @ApiProperty({ type: [GetTermsOfServiceItem] })
  list: GetTermsOfServiceItem[];
}
