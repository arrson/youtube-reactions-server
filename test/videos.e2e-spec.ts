import * as request from 'supertest';
import { useApp } from './helpers';
import { Video } from '@prisma/client';

jest.mock('../src/videos/youtube');

describe('Videos (e2e)', () => {
  let video: Video;
  const getApp = useApp();
  const videoShape = expect.objectContaining({
    id: expect.any(String),
    title: expect.any(String),
    thumbnail: expect.any(String),
    channelId: expect.any(String),
  });

  beforeAll(async () => {
    const { app } = getApp();
    const res = await request(app.getHttpServer())
      .get('/videos')
      .query({ id: 'videoId1' });
    video = res.body[0];
  });

  describe('GET /videos', () => {
    it('returns a list of videos', async () => {
      const { app } = getApp();
      const { status, body } = await request(app.getHttpServer())
        .get('/videos')
        .query({ id: 'videoId1' });

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([videoShape]));
    });

    it('returns videos from cache', async () => {
      const { app } = getApp();
      const { body } = await request(app.getHttpServer())
        .get('/videos')
        .query({ id: 'videoId2,videoId1' });

      const videoFromCache = body.find((d: Video) => d.id === 'videoId1');
      const videoFromYoutube = body.find((d: Video) => d.id === 'videoId2');

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
