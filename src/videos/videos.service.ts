import { difference } from 'lodash';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import videoLoader from './youtube';

@Injectable()
export class VideosService {
  private getVideos: ReturnType<typeof videoLoader>;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.getVideos = videoLoader(configService.get<string>('youtubeApiKey'));
  }

  async getVideosInfo(id: string) {
    const ids = id.split(',');

    // try get videos from cached videos
    const resolved = await this.prisma.video.findMany({
      where: { id: { in: ids } },
    });

    const remainingIds = difference(
      ids,
      resolved.map((d) => d.id),
    );

    if (!remainingIds.length) {
      return resolved;
    }

    // get any remaining ids from youtube api
    // and save to cached videos
    const newVideos = await this.getVideos({ id: remainingIds.join(',') });
    await this.prisma.$transaction(
      newVideos.map((video) =>
        this.prisma.video.upsert({
          where: { id: video.id },
          update: video,
          create: video,
        }),
      ),
    );

    return this.prisma.video.findMany({ where: { id: { in: ids } } });
  }
}
