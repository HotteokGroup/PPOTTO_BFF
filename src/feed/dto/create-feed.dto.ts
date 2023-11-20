import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedRequest {
  @ApiProperty({ description: '피드 내용', example: '피드 내용' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: '피드 콘텐츠(이미지 또는 동영상)',
    type: 'array',
    items: {
      type: 'file',
      format: 'binary',
    },
  })
  files: Express.Multer.File[];
}

@Exclude()
export class CreateFeedResponse {
  @Expose()
  @ApiProperty({ description: '피드 ID', example: 'cln3cu8oc00003cwtl5g5fp46' })
  id: string;
}
