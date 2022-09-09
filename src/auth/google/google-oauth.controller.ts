import { Controller, Get, Req, UseGuards, Render } from '@nestjs/common';
import { Request } from 'express';
import { GoogleOauthGuard } from './google-oauth.guard';
import { JwtAuthService } from '../jwt/jwt-auth.service';

@Controller('auth/google')
export class GoogleOauthController {
  constructor(private jwtAuthService: JwtAuthService) {}

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
}
