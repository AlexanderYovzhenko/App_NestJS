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
      const [type, token] = autHeader.split(' ');

      // check has token and type token
      if (type !== 'Bearer' || !token) {
        throw new ForbiddenException({
          message: 'Forbidden resource',
        });
      }

      // check is correct token
      const user = this.jwtService.verify(token);
      request.user = user;

      const userId = +user.user_id;
      const resourceId = +request.params.id;

      // check if the user has permission to access his resource
      return userId === resourceId;
    } catch (error) {
      throw new ForbiddenException({
        message: 'Forbidden resource',
      });
    }
  }
}
