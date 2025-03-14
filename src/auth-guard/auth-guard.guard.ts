import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from 'src/common/interfaces/cookiesValidate';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies?.auth_token;

    if (!token) {
      throw new UnauthorizedException(
        'Acceso denegado: No hay token en la cookie',
      );
    }

    try {
      const jwtSecret = process.env.JWT_SECRET || 'default_secret_value';
      const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload;

      request.user = decoded;
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(
        'Acceso denegado: Token inválido o expirado',
      );
    }
  }
}
