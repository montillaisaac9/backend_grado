import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Aseguramos que req.cookies tenga un tipo concreto
    const cookies = req.cookies as Record<string, string>;
    const token = cookies['auth_token'];

    if (!token) {
      throw new UnauthorizedException('Authentication token not found');
    }

    // Obtenemos la clave secreta y verificamos que esté definida
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    try {
      // Verificar el token usando la clave secreta
      const decoded = jwt.verify(token, secret);

      // Adjuntar la información decodificada al request (por ejemplo, en req.user)
      req['user'] = decoded;

      // Continuar con el siguiente middleware o controlador
      next();
    } catch (_error) {
      // Usamos _error para ignorar la variable no utilizada y cumplir con las reglas
      console.log(_error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
