import { Injectable } from '@nestjs/common';
import { google, youtube_v3 } from 'googleapis';
import { ConfigService } from '@nestjs/config';

const formatVideo = (video: youtube_v3.Schema$Video) => ({
  id: video.id,
  title: video.snippet.title,
  thumbnail: video.snippet.thumbnails.medium.url,
  publishedAt: video.snippet.publishedAt,
  channelId: video.snippet.channelId,
  channelTitle: video.snippet.channelTitle,
});

const formatChannel = (channel: youtube_v3.Schema$SearchResult) => ({
  channelId: channel.snippet.channelId,
  channelName: channel.snippet.channelTitle,
  imgUrl: channel.snippet.thumbnails.default.url,
});

@Injectable()
export class YoutubeService {
  private youtube: youtube_v3.Youtube;
  constructor(private configService: ConfigService) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: configService.get<string>('youtubeApiKey'),
    });
  }

  async searchByChannelName(name: string) {
    const res = await this.youtube.search.list({
      part: ['snippet'],
      type: ['channel'],
      q: name,
    });

    return res.data.items.map(formatChannel);
  }

  async getVideosInfo(id: string) {
    const listParams: youtube_v3.Params$Resource$Videos$List = {
      part: ['id,snippet,contentDetails'],
      id: [id],
    };
    const res = await this.youtube.videos.list(listParams);
    const listResults: youtube_v3.Schema$VideoListResponse = res.data;
    return listResults.items.map(formatVideo);
  }
}
