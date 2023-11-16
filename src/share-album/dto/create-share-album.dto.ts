import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';

@Exclude()
export class CreateShareAlbumRequest {
  @Expose()
  @ApiProperty({ description: '공유앨범 명', example: '나의 공유앨범' })
  @IsString()
  @Length(2, 20)
  name: string;

  @Expose()
  @ApiProperty({ description: '공유앨범 설명', example: '나의 일상을 공유하는 앨범' })
  @IsString()
  bio: string;
}

@Exclude()
export class CreateShareAlbumResponse {
  @Expose()
  @ApiProperty({ description: '공유앨범 ID', example: 'cln3cu8oc00003cwtl5g5fp46' })
  id: string;
}
