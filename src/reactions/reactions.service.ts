import { Injectable } from '@nestjs/common';
import { keyBy } from 'lodash';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import { VideosService } from '../videos/videos.service';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class ReactionsService {
  constructor(
    private prisma: PrismaService,
    private videoService: VideosService,
  ) {}

  async create(createReactionDto: CreateReactionDto, user: UserEntity) {
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
        createdById: user.id,
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

    const reactionTo = (
      await this.prisma.reaction.findMany({
        where: { reactionId: id },
        include: { reactionTo: true },
      })
    ).map((d) => d.reactionTo);

    const reactions = (
      await this.prisma.reaction.findMany({
        where: { videoId: id },
        include: { reaction: true },
      })
    ).map((d) => d.reaction);

    // if a video is a reaction, get other reactions
    let otherReactions = [];
    if (reactionTo.length) {
      otherReactions = (
        await this.prisma.reaction.findMany({
          where: {
            videoId: { in: reactionTo.map((d) => d.id) },
            NOT: { reactionId: id },
          },
          include: { reaction: true },
        })
      ).map((d) => d.reaction);
    }

    // return a nested object since these lists
    // should be shown and paginated individually
    return {
      reactionTo,
      reactions,
      otherReactions,
    };
  }

  report(reactionId: string) {
    return this.prisma.reaction.update({
      where: { reactionId },
      data: { reportCount: { increment: 1 } },
    });
  }

  remove(reactionId: string) {
    return this.prisma.reaction.delete({ where: { reactionId } });
  }
}
