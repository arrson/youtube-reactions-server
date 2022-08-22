import { ApiProperty } from '@nestjs/swagger';

export class CreateReactionDto {
  @ApiProperty()
  videoId: string;

  @ApiProperty()
  reactionId: string;
}
