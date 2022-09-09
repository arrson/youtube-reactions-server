import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as _AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends _AuthGuard('jwt') {}

@Injectable()
export class AdminGuard extends AuthGuard {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user.isAdmin) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
