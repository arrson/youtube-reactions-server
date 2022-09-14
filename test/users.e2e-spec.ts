import * as request from 'supertest';
import { User } from '@prisma/client';
import { useApp } from './helpers';

describe('Users (e2e)', () => {
  let user: User;
  let admin: User;
  let userToken: string;
  let adminToken: string;

  const beforeAll = async ({ prisma, getUserToken }) => {
    user = await prisma.user.create({
      data: {
        displayName: 'John',
        email: 'john@example.com',
      },
    });
    admin = await prisma.user.create({
      data: {
        displayName: 'Admin',
        email: 'admin@example.com',
        isAdmin: true,
      },
    });
    userToken = getUserToken(user);
    adminToken = getUserToken(admin);
  };

  const getApp = useApp({ beforeAll });
  const userShape = expect.objectContaining({
    id: expect.any(String),
    displayName: expect.any(String),
  });

  // admin only
  describe('GET /users', () => {
    it('returns a list of users as admin', async () => {
      const { app } = getApp();
      const { status, body } = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', 'Bearer ' + adminToken);

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([userShape]));
    });

    it('returns a list of users', async () => {
      const { app } = getApp();
      const { status, body } = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', 'Bearer ' + userToken);

      expect(status).toBe(401);
      expect(body.message).toEqual('Unauthorized');
    });
  });

  // describe('GET /users/:id', () => {
  //   it('returns a user', async () => {
  //     const { app } = getApp();
  //     const { status, body } = await request(app.getHttpServer()).get(
  //       `/users/${user.id}`,
  //     );

  //     expect(status).toBe(200);
  //     expect(body).toStrictEqual(userShape);
  //   });
  // });

  // describe('PATCH /users/:id', () => {
  //   it('updates a user', async () => {
  //     const { app } = getApp();
  //     const { status, body } = await request(app.getHttpServer())
  //       .patch(`/users/${user.id}`)
  //       .send({
  //         name: 'ModifiedName',
  //       });

  //     expect(status).toBe(200);
  //     expect(body).toStrictEqual(userShape);
  //   });
  // });

  // describe('DELETE /users/:id', () => {
  //   it('deletes a user', async () => {
  //     const { app } = getApp();
  //     const { status, body } = await request(app.getHttpServer()).delete(
  //       `/users/${user.id}`,
  //     );

  //     expect(status).toBe(200);
  //     expect(body).toStrictEqual(userShape);

  //     const res = await request(app.getHttpServer()).get(`/users/${user.id}`);
  //     expect(res.status).toBe(200);
  //     expect(res.body).toStrictEqual({});
  //   });
  // });
});
