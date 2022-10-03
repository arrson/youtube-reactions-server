import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { ReactionsModule } from './reactions/reactions.module';
import { VideosModule } from './videos/videos.module';
import config from './config';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AuthModule,
    HealthModule,
    UsersModule,
    ReactionsModule,
    VideosModule,
    PassportModule,
    SearchModule,
  ],
})
export class AppModule {}
