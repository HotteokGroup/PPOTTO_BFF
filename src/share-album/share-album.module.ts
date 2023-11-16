import { Module } from '@nestjs/common';

import { ShareAlbumController } from './share-album.controller';
import { ShareAlbumService } from './share-album.service';
import { SocialClientModule } from '../internal/social/social.module';
import { JwtUtilityModule } from '../lib/jwt/jwt-utility.module';

@Module({
  imports: [SocialClientModule, JwtUtilityModule],
  providers: [ShareAlbumService],
  controllers: [ShareAlbumController],
})
export class ShareAlbumModule {}
