import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BanGuard implements CanActivate {
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
          message: 'User is banned',
        });
      }

      // check is correct token
      const user = this.jwtService.verify(token);
      request.user = user;

      console.log(user.profile.banned);

      const userBan = user.profile.banned;

      // check if the user has a ban
      return !userBan;
    } catch (error) {
      throw new ForbiddenException({
        message: 'User is banned',
      });
    }
  }
}
