import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { FeedContentType } from '../../internal/social-client/feed/feed.enum';

class CreateFeedItem {
  @ApiProperty({ description: '콘텐츠 ID', example: '123g21hj2' })
  @IsString()
  @IsNotEmpty()
  contentId: string;

  @ApiProperty({ description: '콘텐츠 타입', example: FeedContentType.Image, enum: FeedContentType })
  @IsEnum(FeedContentType)
  type: FeedContentType;

  @ApiProperty({ description: '콘텐츠 URL', example: 'https://image.com' })
  @IsOptional()
  @IsString()
  contentSmallUrl?: string;

  @ApiProperty({ description: '콘텐츠 URL', example: 'https://image.com' })
  @IsOptional()
  @IsString()
  contentMediumUrl?: string;

  @ApiProperty({ description: '콘텐츠 URL', example: 'https://image.com' })
  @IsOptional()
  @IsString()
  contentLargeUrl?: string;
}

export class CreateFeedRequest {
  @ApiProperty({ description: '피드 내용', example: '피드 내용' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: '피드 콘텐츠' })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CreateFeedItem)
  contents: CreateFeedItem[];
}

@Exclude()
export class CreateFeedResponse {
  @Expose()
  @ApiProperty({ description: '피드 ID', example: 'cln3cu8oc00003cwtl5g5fp46' })
  id: string;
}
