import * as request from 'supertest';
import { useApp } from './helpers';
import { Video } from '@prisma/client';

describe('Videos (e2e)', () => {
  let video: Video;
  const getApp = useApp({
    beforeAll: async ({ app }) => {
      const res = await request(app.getHttpServer())
        .get('/videos')
        .query({ id: 'videoId1' });
      video = res.body[0];
    },
  });
  const videoShape = expect.objectContaining({
    id: expect.any(String),
    title: expect.any(String),
    thumbnail: expect.any(String),
    channelId: expect.any(String),
  });

  describe('GET /videos', () => {
    it('returns a list of videos', async () => {
      const { app } = getApp();
      const { status, body } = await request(app.getHttpServer())
        .get('/videos')
        .query({ id: video.id });

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([videoShape]));
    });

    it('returns videos from cache', async () => {
      const newVideoId = 'videoId2';

      const { app } = getApp();
      const { body } = await request(app.getHttpServer())
        .get('/videos')
        .query({ id: `${newVideoId},${video.id}` });

      const videoFromCache = body.find((d: Video) => d.id === video.id);
      const videoFromYoutube = body.find((d: Video) => d.id === newVideoId);

      expect(videoFromCache.createdAt < videoFromYoutube.createdAt).toEqual(
        true,
      );
    });

    it('throws an error if id is not provided', async () => {
      const { app } = getApp();
      const { status, body } = await request(app.getHttpServer()).get(
        '/videos',
      );

      expect(status).toBe(400);
      expect(body.error).toEqual('"id" is required.');
    });
  });
});
