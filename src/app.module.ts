import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { ReactionsModule } from './reactions/reactions.module';

@Module({
  imports: [ConfigModule.forRoot(), HealthModule, UsersModule, ReactionsModule],
})
export class AppModule {}
