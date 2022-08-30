import { google, youtube_v3 } from 'googleapis';

const youtube: youtube_v3.Youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

const format = (video: youtube_v3.Schema$Video) => ({
  id: video.id,
  title: video.snippet.title,
  thumbnail: video.snippet.thumbnails.medium.url,
  publishedAt: video.snippet.publishedAt,
  channelId: video.snippet.channelId,
  channelTitle: video.snippet.channelTitle,
});

export const getVideos = async ({ id }) => {
  const listParams: youtube_v3.Params$Resource$Videos$List = {
    part: ['id,snippet,contentDetails'],
    id: [id],
  };
  const res = await youtube.videos.list(listParams);
  const listResults: youtube_v3.Schema$VideoListResponse = res.data;
  return listResults.items.map(format);
};
