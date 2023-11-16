import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { CreateShareAlbumRequest, CreateShareAlbumResponse } from './dto/create-share-album.dto';
import { GetShareAlbumResponse } from './dto/get-share-album.dto';
import { ModifyShareAlbumRequest, ModifyShareAlbumResponse } from './dto/modify-share-album.dto';
import { ShareAlbumService } from './share-album.service';
import { ERROR_CODE, GenerateSwaggerDocumentByErrorCode } from '../lib/exception/error.constant';
import { UserInfo } from '../lib/jwt/decorators/auth-jwt.decorator';
import { AuthJwtGuard } from '../lib/jwt/guards/auth-jwt.guard';
import { AuthJwtPayload } from '../lib/jwt/jwt-utility.interface';

@Controller('share-album')
@ApiTags('앨범')
export class ShareAlbumController {
  constructor(private readonly shareAlbumService: ShareAlbumService) {}

  @ApiOperation({
    summary: '공유앨범 생성',
    description: '공유앨범을 생성합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([ERROR_CODE.INTERNAL_SERVER_ERROR, ERROR_CODE.INVALID_DATA])
  @ApiBearerAuth('jwt')
  @UseGuards(AuthJwtGuard)
  @Post()
  async createShareAlbum(@UserInfo() user: AuthJwtPayload, @Body() data: CreateShareAlbumRequest) {
    return plainToInstance(
      CreateShareAlbumResponse,
      await this.shareAlbumService.create({
        name: data.name,
        bio: data.bio,
        ownerId: user.id,
      }),
    );
  }

  @ApiOperation({
    summary: '공유앨범 조회',
    description: '공유앨범을 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '공유앨범 ID',
    example: 'cln3cu8oc00003cwtl5g5fp46',
  })
  @GenerateSwaggerDocumentByErrorCode([
    ERROR_CODE.INTERNAL_SERVER_ERROR,
    ERROR_CODE.INVALID_DATA,
    ERROR_CODE.SHARE_ALBUM_NOT_FOUND,
    ERROR_CODE.SHARE_ALBUM_INSUFFICIENT_PERMISSION,
  ])
  @ApiBearerAuth('jwt')
  @UseGuards(AuthJwtGuard)
  @Get(':id')
  async getSharedAlbum(@Param('id') id: string, @UserInfo() user: AuthJwtPayload) {
    return plainToInstance(
      GetShareAlbumResponse,
      await this.shareAlbumService.get({
        id,
        userId: user.id,
      }),
    );
  }

  @ApiOperation({
    summary: '공유앨범 수정',
    description: '공유앨범을 수정합니다.',
  })
  @GenerateSwaggerDocumentByErrorCode([
    ERROR_CODE.INTERNAL_SERVER_ERROR,
    ERROR_CODE.INVALID_DATA,
    ERROR_CODE.SHARE_ALBUM_NOT_FOUND,
    ERROR_CODE.SHARE_ALBUM_INSUFFICIENT_PERMISSION,
  ])
  @ApiBearerAuth('jwt')
  @UseGuards(AuthJwtGuard)
  @Patch(':id')
  async modifyShareAlbum(
    @Param('id') id: string,
    @UserInfo() user: AuthJwtPayload,
    @Body() data: ModifyShareAlbumRequest,
  ) {
    return plainToInstance(
      ModifyShareAlbumResponse,
      await this.shareAlbumService.modify({
        id,
        userId: user.id,
        name: data.name,
        bio: data.bio,
      }),
    );
  }
}
