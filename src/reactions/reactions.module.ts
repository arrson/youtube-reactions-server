import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { VideosModule } from '../videos/videos.module';

@Module({
  controllers: [ReactionsController],
  providers: [ReactionsService],
  imports: [PrismaModule, VideosModule],
})
export class ReactionsModule {}
