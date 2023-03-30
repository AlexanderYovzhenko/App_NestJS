import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const autHeader = request.headers.authorization || request.headers.header;
      const token = autHeader.split(' ')[1];

      const user = this.jwtService.verify(token);
      request.user = user;

      const userId = +user.user_id;
      const resourceId = +request.params.id;

      // Check if the user has permission to access the resource
      return userId === resourceId;
    } catch (error) {
      throw new ForbiddenException({
        message: 'Нет доступа, это не Ваш профиль',
      });
    }
  }
}
