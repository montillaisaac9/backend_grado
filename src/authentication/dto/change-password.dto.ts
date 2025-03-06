// change-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Correo del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Rol del usuario (admin o estudiante)' })
  @IsEnum(['empleado', 'estudiante'])
  role: 'empleado' | 'estudiante';

  @ApiProperty({
    description: 'Palabra de seguridad del usuario',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  palabra_seguridad: string;

  @ApiProperty({ description: 'Nueva contraseña del usuario', minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
