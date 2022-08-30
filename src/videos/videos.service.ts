import { difference } from 'lodash';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { getVideos } from './youtube';

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}

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
    const newVideos = await getVideos({ id: remainingIds.join(',') });
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
