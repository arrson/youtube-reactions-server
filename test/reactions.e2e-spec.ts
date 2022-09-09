import * as request from 'supertest';
import { Reaction } from '@prisma/client';
import { useApp, getUserToken } from './helpers';

jest.mock('../src/videos/youtube');

describe('Reactions (e2e)', () => {
  let reaction: Reaction;
  let userToken: string;

  const beforeAll = async ({ app, prisma }) => {
    const user = await prisma.user.create({
      data: {
        displayName: 'John Reactions',
        email: 'john_reactions@example.com',
      },
    });
    userToken = getUserToken(user);

    const res = await request(app.getHttpServer())
      .post('/reactions')
      .set('Authorization', 'Bearer ' + userToken)
      .send({ reactionId: 'video2', videoId: 'video1' });
    reaction = res.body;
  };

  const getApp = useApp({
    beforeAll,
  });

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

  describe('POST /reactions', () => {
    it('creates a reaction', async () => {
      const { app } = getApp();

      const beforeReactions = await request(app.getHttpServer()).get(
        '/reactions',
      );
      const beforeCount = beforeReactions.body.length;

      const { status, body } = await request(app.getHttpServer())
        .post('/reactions')
        .set('Authorization', 'Bearer ' + userToken)
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
      expect(body.reactions).toStrictEqual(
        expect.arrayContaining([videoShape]),
      );
      expect(body.reactionTo.length).toEqual(0);
      expect(body.otherReactions.length).toEqual(0);
    });

    it('get a origin videos', async () => {
      const { app } = getApp();
      const { status, body } = await request(app.getHttpServer()).get(
        `/videos/${reaction.reactionId}/videos`,
      );

      expect(status).toBe(200);
      expect(body.reactions.length).toEqual(0);
      expect(body.reactionTo).toStrictEqual(
        expect.arrayContaining([videoShape]),
      );
      expect(body.otherReactions).toStrictEqual(
        expect.arrayContaining([videoShape]),
      );
    });
  });

  describe('POST /reactions/:id/report', () => {
    it('report a reaction', async () => {
      const { app } = getApp();
      const { body } = await request(app.getHttpServer())
        .post(`/reactions/${reaction.reactionId}/report`)
        .set('Authorization', 'Bearer ' + userToken);
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

      const { status, body } = await request(app.getHttpServer())
        .delete(`/reactions/${reaction.reactionId}`)
        .set('Authorization', 'Bearer ' + userToken);
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
