import { Injectable } from '@nestjs/common';
import { keyBy } from 'lodash';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import { VideosService } from '../videos/videos.service';

@Injectable()
export class ReactionsService {
  constructor(
    private prisma: PrismaService,
    private videoService: VideosService,
  ) {}

  async create(createReactionDto: CreateReactionDto) {
    const existingReaction = await this.prisma.reaction.findUnique({
      where: { reactionId: createReactionDto.reactionId },
    });
    if (existingReaction) {
      throw new Error('reaction already exists');
    }

    const videos = await this.videoService.getVideosInfo(
      [createReactionDto.videoId, createReactionDto.reactionId].join(','),
    );
    const videoMap = keyBy(videos, 'id');

    if (!videoMap[createReactionDto.videoId]) {
      throw new Error('videoId not found.');
    }

    if (!videoMap[createReactionDto.reactionId]) {
      throw new Error('reactionId not found.');
    }

    const originalVideo = await this.prisma.video.upsert({
      where: { id: createReactionDto.videoId },
      update: {},
      create: videoMap[createReactionDto.videoId],
    });

    const reactionVideo = await this.prisma.video.upsert({
      where: { id: createReactionDto.reactionId },
      update: {},
      create: videoMap[createReactionDto.reactionId],
    });

    return this.prisma.reaction.create({
      data: {
        reactionId: reactionVideo.id,
        videoId: originalVideo.id,
      },
    });
  }

  findAll() {
    return this.prisma.reaction.findMany({
      include: {
        reaction: true,
        reactionTo: true,
      },
    });
  }

  async getReactionsForVideo(id: string) {
    if (!id) {
      throw Error('video must be specified');
    }

    const video = await this.prisma.video.findUnique({
      where: { id },
      include: {
        reactions: true,
      },
    });

    if (!video) {
      return [];
    }

    return this.prisma.video.findMany({
      where: {
        id: { in: video.reactions.map((d) => d.reactionId) },
      },
    });
  }

  report(reactionId: string) {
    return this.prisma.reaction.update({
      where: { reactionId },
      data: { reportCount: { increment: 1 } },
    });
  }
}
