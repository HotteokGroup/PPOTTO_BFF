import { Body, Controller, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { CreateFeedRequest, CreateFeedResponse } from './dto/create-feed.dto';
import { FeedService } from './feed.service';
import { ERROR_CODE, GenerateSwaggerDocumentByErrorCode } from '../lib/exception/error.constant';
import { UserInfo } from '../lib/jwt/decorators/auth-jwt.decorator';
import { AuthJwtGuard } from '../lib/jwt/guards/auth-jwt.guard';
import { AuthJwtPayload } from '../lib/jwt/jwt-utility.interface';

@Controller()
@ApiTags('피드')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @ApiOperation({
    summary: '피드 생성',
    description: '피드를 생성합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: '공유앨범 ID',
    example: 'cln3cu8oc00003cwtl5g5fp46',
  })
  @GenerateSwaggerDocumentByErrorCode([
    ERROR_CODE.INTERNAL_SERVER_ERROR,
    ERROR_CODE.INVALID_DATA,
    ERROR_CODE.SHARE_ALBUM_NOT_FOUND,
    ERROR_CODE.SHARE_ALBUM_MEMBER_NOT_FOUND,
  ])
  @ApiBearerAuth('jwt')
  @UseGuards(AuthJwtGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  @Post('share-album/:id/feed')
  async createFeed(
    @UserInfo() user: AuthJwtPayload,
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id')
    id: string,
    @Body() data: CreateFeedRequest,
  ) {
    return plainToInstance(
      CreateFeedResponse,
      await this.feedService.create({
        shareAlbumId: id,
        userId: user.id,
        description: data.description,
        contents: files,
      }),
    );
  }
}
