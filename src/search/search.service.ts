import { Injectable } from '@nestjs/common';
import { YoutubeService } from 'src/youtube/youtube.service';

@Injectable()
export class SearchService {
  constructor(private youtubeService: YoutubeService) {}

  async searchByChannelName(name: string) {
    return this.youtubeService.searchByChannelName(name);
  }
}
