export class LoginDto {
  correo: string;
  contraseña: string;
  role: 'admin' | 'estudiante';
}
