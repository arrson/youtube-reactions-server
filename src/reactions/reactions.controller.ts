import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

import { ReactionEntity } from './entities/reaction.entity';
import { VideoEntity } from '../videos/entities/video.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post('reactions')
  @ApiCreatedResponse({ type: ReactionEntity })
  async create(@Body() createReactionDto: CreateReactionDto) {
    try {
      const res = await this.reactionsService.create(createReactionDto);
      return res;
    } catch (e) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: e.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('reactions')
  @ApiOkResponse({ type: ReactionEntity, isArray: true })
  findAll() {
    return this.reactionsService.findAll();
  }

  @Get('videos/:id/videos')
  @ApiOkResponse({ type: VideoEntity, isArray: true })
  getReactionsForVideo(@Param('id') id: string) {
    return this.reactionsService.getReactionsForVideo(id);
  }

  @Post('reactions/:id/report')
  @ApiOkResponse({ type: ReactionEntity })
  report(@Param('id') id: string) {
    return this.reactionsService.report(id);
  }
}
