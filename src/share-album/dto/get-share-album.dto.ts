import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetShareAlbumResponse {
  @Expose()
  @ApiProperty({ description: '앨범 ID', example: 'cln3cu8oc00003cwtl5g5fp46' })
  id: string;

  @Expose()
  @ApiProperty({ description: '앨범 명', example: '나의 공유앨범' })
  name: string;

  @Expose()
  @ApiProperty({ description: '앨범 소개', example: '나의 공유앨범 소개', nullable: true })
  bio: string;
}
