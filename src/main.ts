import { NestFactory } from '@nestjs/core';
import { Logger, INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as passport from 'passport';
import { resolve } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

const initializeSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Youtube reactions')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  initializeSwagger(app);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  app.use(passport.initialize());

  app.useStaticAssets(resolve('./src/public'));
  app.setBaseViewsDir(resolve('./src/views'));
  app.setViewEngine('hbs');

  await app.listen(port);
  Logger.log(`Server started on port: ${port}.`);
}
bootstrap();
