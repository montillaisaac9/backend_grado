import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Request } from 'express';
import { Role } from '@prisma/client';

interface RequestWithUser extends Request {
  user?: {
    id: number;
    role: Role;
    // Puedes agregar otras propiedades si es necesario
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Se utiliza el método genérico para especificar el tipo del request
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    console.log(user?.role);

    if (!user || !user.role) {
      throw new ForbiddenException(
        'Acceso denegado: No se encontró el role del usuario',
      );
    }

    if (requiredRoles.includes(user.role)) {
      return true;
    } else {
      throw new ForbiddenException(
        'Acceso denegado: No tienes permisos para esta ruta',
      );
    }
  }
}
