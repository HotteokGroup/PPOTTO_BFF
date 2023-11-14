import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, ArrayUnique, IsArray, IsNumber } from 'class-validator';

export class AgreeTermsOfServiceRequest {
  @ApiProperty({ description: '동의할 약관 아이디' })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsNumber({}, { each: true })
  termsOfServiceIds: number[];
}
