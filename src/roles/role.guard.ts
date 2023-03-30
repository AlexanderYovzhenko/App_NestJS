import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role-auth.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const autHeader = request.headers.authorization || request.headers.header;
      const token = autHeader.split(' ')[1];

      const user = this.jwtService.verify(token);
      request.user = user;

      // Check if the user has permission to access the resource
      return user.roles.some((role: { value: string }) =>
        requiredRoles.includes(role.value),
      );
    } catch (e) {
      throw new ForbiddenException({
        message: 'Нет доступа',
      });
    }
  }
}
