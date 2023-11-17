import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class JoinShareAlbumByInviteCodeResponse {
  @Expose()
  @ApiProperty({ description: '공유앨범 ID', example: 'cln3cu8oc00003cwtl5g5fp46' })
  shareAlbumId: string;
}
