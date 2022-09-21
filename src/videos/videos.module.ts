import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { YoutubeModule } from '../youtube/youtube.module';

@Module({
  controllers: [VideosController],
  providers: [VideosService],
  imports: [PrismaModule, YoutubeModule],
  exports: [VideosService],
})
export class VideosModule {}
