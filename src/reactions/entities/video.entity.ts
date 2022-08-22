import { Video } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class VideoEntity implements Video {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  channelId: string;

  @ApiProperty()
  publishedAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
