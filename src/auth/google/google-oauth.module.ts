import { Module } from '@nestjs/common';
import { UsersModule } from '../../users/users.module';
import { JwtAuthModule } from '../jwt/jwt-auth.module';
import { GoogleOauthController } from './google-oauth.controller';
import { GoogleOauthStrategy } from './google-oauth.strategy';
import { GoogleOauthService } from './google-oauth.service';

@Module({
  imports: [UsersModule, JwtAuthModule],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthStrategy, GoogleOauthService],
})
export class GoogleOauthModule {}
