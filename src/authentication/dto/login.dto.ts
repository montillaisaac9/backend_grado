import { IsString, Matches, IsNotEmpty, IsEnum } from 'class-validator';

export default class LoginDto {
  @IsString({ message: 'El correo debe ser una cadena de texto' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message:
      'El correo debe tener un formato válido (ejemplo: usuario@dominio.com)',
  })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  password: string;

  @IsEnum(['admin', 'estudiante'], {
    message: 'El rol debe ser admin o estudiante',
  })
  role: 'admin' | 'estudiante';
}
