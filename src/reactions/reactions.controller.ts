import {
  Controller,
  Get,
  Post,
  Delete,
  Request,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

import { ReactionEntity } from './entities/reaction.entity';
import { VideoEntity } from '../videos/entities/video.entity';
import { AuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @UseGuards(AuthGuard)
  @Post('reactions')
  @ApiCreatedResponse({ type: ReactionEntity })
  async create(@Request() req, @Body() createReactionDto: CreateReactionDto) {
    try {
      const res = await this.reactionsService.create(
        createReactionDto,
        req.user,
      );
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
  getReactionsForVideo(
    @Query('channelId') channelId: string,
    @Param('id') id: string,
  ) {
    return this.reactionsService.getReactionsForVideo(id, channelId);
  }

  @UseGuards(AuthGuard)
  @Post('reactions/:id/report')
  @ApiOkResponse({ type: ReactionEntity })
  report(@Param('id') id: string) {
    return this.reactionsService.report(id);
  }

  // todo: should check whether user is authorized to delete
  @UseGuards(AuthGuard)
  @Delete('reactions/:id')
  @ApiOkResponse({ type: ReactionEntity })
  remove(@Param('id') id: string) {
    return this.reactionsService.remove(id);
  }
}
