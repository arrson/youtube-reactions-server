import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const initializeSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Youtube reactions')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  initializeSwagger(app);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
