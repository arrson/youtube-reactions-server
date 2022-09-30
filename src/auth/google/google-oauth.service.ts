import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { UsersService } from '../../users/users.service';

import { google, Auth } from 'googleapis';

@Injectable()
export class GoogleOauthService {
  private oauth2Client: Auth.OAuth2Client;

  constructor(
    private jwtAuthService: JwtAuthService,
    private configService: ConfigService,
    @Inject(UsersService) private readonly userService: UsersService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      configService.get<string>('google.clientID'),
      configService.get<string>('google.secret'),
      configService.get<string>('google.callbackURL'),
    );
  }

  async getUserFromToken(idToken: string) {
    const info = await this.oauth2Client.verifyIdToken({
      idToken,
      audience: this.configService.get<string>('google.clientID'),
    });
    const payload = info.getPayload();

    const user = await this.userService.findOneByEmail(payload.email);
    return user;
  }
}
