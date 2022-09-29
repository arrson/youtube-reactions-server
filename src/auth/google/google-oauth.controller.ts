import { Controller, Get, Req, Query, UseGuards, Render } from '@nestjs/common';
import { Request } from 'express';
import { GoogleOauthGuard } from './google-oauth.guard';
import { GoogleOauthService } from './google-oauth.service';
import { JwtAuthService } from '../jwt/jwt-auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth/google')
export class GoogleOauthController {
  constructor(
    private jwtAuthService: JwtAuthService,
    private configService: ConfigService,
    private readonly googleOauthService: GoogleOauthService,
  ) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    return true;
  }

  @Get('redirect')
  @UseGuards(GoogleOauthGuard)
  @Render('authenticated')
  async googleAuthRedirect(@Req() req: Request) {
    const { accessToken } = this.jwtAuthService.login(req.user);
    return { token: accessToken };
  }

  @Get('token')
  async getToken(@Query('code') code: string) {
    const user = await this.googleOauthService.getUserFromToken(code);
    const { accessToken } = this.jwtAuthService.login(user);
    return { token: accessToken };
  }
}
