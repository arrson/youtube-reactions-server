import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import * as passport from 'passport';
import { sign } from 'jsonwebtoken';

interface useAppArguements {
  app: NestExpressApplication;
  prisma: PrismaService;
}
interface useAppInterface {
  beforeAll?: (a?: useAppArguements) => Promise<void>;
  afterAll?: (a?: useAppArguements) => Promise<void>;
}

export const useApp = ({
  beforeAll: _beforeAll,
  afterAll: _afterAll,
}: useAppInterface = {}) => {
  let app: NestExpressApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();

    app.use(passport.initialize());
    app.useStaticAssets(resolve('./src/public'));
    app.setBaseViewsDir(resolve('./src/views'));
    app.setViewEngine('hbs');

    prisma = app.get<PrismaService>(PrismaService);

    await app.init();
    if (_beforeAll) {
      await _beforeAll({ app, prisma });
    }
  });

  afterAll(async () => {
    await prisma.truncate();
    await prisma.resetSequences();
    await prisma.$disconnect();
    await app.close();
    if (_afterAll) {
      await _afterAll({ app, prisma });
    }
  });

  afterEach(async () => {
    // TODO: use transactions and transaction rollback once prisma supports it
  });

  return () => ({
    app,
    prisma,
  });
};

export const getUserToken = (user) =>
  sign({ id: user.id }, process.env.JWT_SECRET);
