import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

interface JwtUser {
  id: string;
  email: string;
  [key: string]: any;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = JwtUser>(err: Error | null, user: TUser | null): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
