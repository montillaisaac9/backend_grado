import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, IsNotEmpty, IsEnum } from 'class-validator';

export default class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsString({ message: 'El correo debe ser una cadena de texto' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message:
      'El correo debe tener un formato válido (ejemplo: usuario@dominio.com)',
  })
  email: string;

  @ApiProperty({ example: 'securePassword123', description: 'User password' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  password: string;

  @ApiProperty({
    example: 'admin',
    description: 'User role, either admin or student',
  })
  @IsEnum(['empleado', 'estudiante'], {
    message: 'El rol debe ser admin o estudiante',
  })
  role: 'empleado' | 'estudiante';
}
