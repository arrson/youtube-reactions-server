import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

export type JwtPayload = { id: string };

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsersService) private readonly userService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req: any) =>
        ExtractJwt.fromAuthHeaderAsBearerToken()(req) ||
        ExtractJwt.fromHeader('x-api-key')(req) ||
        ExtractJwt.fromUrlQueryParameter('token')(req),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findOne(payload.id);
    return user;
  }
}
