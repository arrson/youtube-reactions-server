import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(UsersService) private readonly userService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('google.clientID'),
      clientSecret: configService.get<string>('google.secret'),
      callbackURL: configService.get<string>('google.callbackURL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const userInfo = {
      email: profile.emails[0].value,
      displayName: profile.displayName,
    };

    let user = await this.userService.findOneByEmail(userInfo.email);
    if (!user) {
      user = await this.userService.create(userInfo);
    }
    return user;
  }
}
