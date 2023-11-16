import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';

@Exclude()
export class ModifyShareAlbumRequest {
  @Expose()
  @ApiProperty({ description: '공유앨범 명', example: '나의 공유앨범' })
  @IsString()
  @Length(2, 20)
  @IsOptional()
  name?: string;

  @Expose()
  @ApiProperty({ description: '공유앨범 설명', example: '나의 일상을 공유하는 앨범' })
  @IsString()
  @IsOptional()
  bio?: string;
}

@Exclude()
export class ModifyShareAlbumResponse {
  @Expose()
  @ApiProperty({ description: '공유앨범 ID', example: 'cln3cu8oc00003cwtl5g5fp46' })
  id: string;
}
