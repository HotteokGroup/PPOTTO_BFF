import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class CreateInviteCodeForShareAlbumRequest {
  @Expose()
  @ApiProperty({ description: '공유앨범 ID', example: 'cln3cu8oc00003cwtl5g5fp46' })
  @IsString()
  @IsNotEmpty()
  id: string;
}

@Exclude()
export class CreateInviteCodeForShareAlbumResponse {
  @Expose()
  @ApiProperty({ description: '생성된 초대코드', example: 'I8Q32D' })
  inviteCode: string;
}
