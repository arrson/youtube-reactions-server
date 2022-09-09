import { Reaction } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ReactionEntity implements Reaction {
  @ApiProperty()
  reactionId!: string;

  @ApiProperty()
  videoId!: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  reportCount: number;

  createdById: string;
}
