import * as request from 'supertest';
import { Reaction } from '@prisma/client';
import { useApp } from './helpers';

jest.mock('../src/videos/youtube');

describe('Reactions (e2e)', () => {
  let reaction: Reaction;
  const getApp = useApp();
  const reactionShape = expect.objectContaining({
    reactionId: expect.any(String),
    videoId: expect.any(String),
    reportCount: expect.any(Number),
  });
  const videoShape = expect.objectContaining({
    id: expect.any(String),
    title: expect.any(String),
    thumbnail: expect.any(String),
    channelId: expect.any(String),
  });

  beforeAll(async () => {
    const { app } = getApp();
    const res = await request(app.getHttpServer()).post('/reactions').send({
      reactionId: 'video2',
      videoId: 'video1',
    });
    reaction = res.body;
  });

  describe('POST /reactions', () => {
    it('creates a reaction', async () => {
      const { app } = getApp();

      const beforeReactions = await request(app.getHttpServer()).get(
        '/reactions',
      );
      const beforeCount = beforeReactions.body.length;

      const { status, body } = await request(app.getHttpServer())
        .post('/reactions')
        .send({ reactionId: 'video3', videoId: 'video1' });
      expect(status).toBe(201);
      expect(body).toStrictEqual(reactionShape);

      const afterReactions = await request(app.getHttpServer()).get(
        '/reactions',
      );
      const afterCount = afterReactions.body.length;

      expect(afterCount - beforeCount).toBe(1);
    });
  });

  describe('GET /reactions', () => {
    it('returns a list of reactions', async () => {
      const { app } = getApp();
      const { status, body } = await request(app.getHttpServer()).get(
        '/reactions',
      );

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([reactionShape]));
    });
  });

  describe('GET /videos/:id/videos', () => {
    it('get a reaction videos', async () => {
      const { app } = getApp();
      const { status, body } = await request(app.getHttpServer()).get(
        `/videos/${reaction.videoId}/videos`,
      );

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([videoShape]));
    });
  });

  describe('POST /reactions/:id/report', () => {
    it('report a reaction', async () => {
      const { app } = getApp();
      const { body } = await request(app.getHttpServer()).post(
        `/reactions/${reaction.reactionId}/report`,
      );

      expect(body.reportCount).toStrictEqual(reaction.reportCount + 1);
    });
  });

  describe('DELETE /reactions/:id', () => {
    it('delete a reaction', async () => {
      const { app } = getApp();

      const beforeReactions = await request(app.getHttpServer()).get(
        '/reactions',
      );
      const beforeCount = beforeReactions.body.length;

      const { status, body } = await request(app.getHttpServer()).delete(
        `/reactions/${reaction.reactionId}`,
      );

      expect(status).toBe(200);
      expect(body).toStrictEqual(reactionShape);

      const afterReactions = await request(app.getHttpServer()).get(
        '/reactions',
      );
      const afterCount = afterReactions.body.length;

      expect(beforeCount - afterCount).toBe(1);
    });
  });
});
