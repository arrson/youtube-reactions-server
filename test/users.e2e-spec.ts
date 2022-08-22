import * as request from 'supertest';
import { User } from '@prisma/client';
import { useApp } from './helpers';

describe('Users (e2e)', () => {
  let user: User;
  const getApp = useApp();
  const userShape = expect.objectContaining({
    id: expect.any(String),
    name: expect.any(String),
  });

  beforeAll(async () => {
    const { prisma } = getApp();
    user = await prisma.user.create({
      data: {
        id: 'user_test_1',
        name: 'John',
      },
    });
  });

  describe('GET /users', () => {
    it('returns a list of users', async () => {
      const { app } = getApp();
      const { status, body } = await request(app.getHttpServer()).get('/users');

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([userShape]));
    });
  });

  describe('GET /users/:id', () => {
    it('returns a user', async () => {
      const { app } = getApp();
      const { status, body } = await request(app.getHttpServer()).get(
        `/users/${user.id}`,
      );

      expect(status).toBe(200);
      expect(body).toStrictEqual(userShape);
    });
  });

  describe('POST /users', () => {
    it('creates a user', async () => {
      const { app, prisma } = getApp();
      const beforeCount = await prisma.user.count();
      const { status, body } = await request(app.getHttpServer())
        .post('/users')
        .send({
          id: 'user_test_2',
          name: 'John2',
        });

      const afterCount = await prisma.user.count();

      expect(status).toBe(201);
      expect(body).toStrictEqual(userShape);
      expect(afterCount - beforeCount).toBe(1);
    });
  });

  describe('PATCH /users/:id', () => {
    it('updates a user', async () => {
      const { app } = getApp();
      const { status, body } = await request(app.getHttpServer())
        .patch(`/users/${user.id}`)
        .send({
          name: 'ModifiedName',
        });

      expect(status).toBe(200);
      expect(body).toStrictEqual(userShape);
    });
  });

  describe('DELETE /users/:id', () => {
    it('deletes a user', async () => {
      const { app } = getApp();
      const { status, body } = await request(app.getHttpServer()).delete(
        `/users/${user.id}`,
      );

      expect(status).toBe(200);
      expect(body).toStrictEqual(userShape);

      const res = await request(app.getHttpServer()).get(`/users/${user.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toStrictEqual({});
    });
  });
});
