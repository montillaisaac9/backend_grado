import { Request } from 'express';

export interface JwtPayload {
  id: number;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  cookies: { auth_token?: string };
  user?: any; // Define el tipo correcto si es posible
}
