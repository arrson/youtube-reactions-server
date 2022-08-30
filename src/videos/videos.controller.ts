import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideoEntity } from './entities/video.entity';

import { ApiOkResponse } from '@nestjs/swagger';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  @ApiOkResponse({ type: VideoEntity, isArray: true })
  getIds(@Query('id') id: string) {
    if (!id) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: '"id" is required.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.videosService.getVideosInfo(id);
  }
}
