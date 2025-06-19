// change-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Correo del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Palabra de seguridad del usuario',
  })
  @IsString()
  @IsNotEmpty()
  securityWord: string;

  @ApiProperty({ description: 'Nueva contraseña del usuario', minLength: 6 })
  @IsString()
  @MinLength(1)
  newPassword: string;
}
