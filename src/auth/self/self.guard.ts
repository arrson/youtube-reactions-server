import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SelfDecoratorParams } from './self.decorator';
import { User } from '@prisma/client';
import { get } from 'lodash';

@Injectable()
export class SelfGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    const selfParams = this.reflector.get<SelfDecoratorParams>(
      'selfParams',
      context.getHandler(),
    );
    const allowAdmins = get(selfParams, 'allowAdmins', true);
    const userIDParam = get(selfParams, 'userIDParam', 'id');

    if (!user) return false;
    if (user.isAdmin && allowAdmins) return true;
    if (request.params[userIDParam] == user.id) return true;
  }
}
