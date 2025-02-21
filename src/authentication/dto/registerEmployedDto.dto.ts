import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';

export default class RegisterEmployedDto {
  @IsEnum(['admin', 'estudiante'], {
    message: 'El rol debe ser admin o estudiante',
  })
  role: 'admin' | 'estudiante';

  @IsEmail({}, { message: 'El correo no es válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  correo: string;

  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  @IsString({ message: 'La cédula debe ser un texto' })
  cedula: string;

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contraseña: string;

  @IsNotEmpty({ message: 'La palabra de seguridad es obligatoria' })
  palabra_seguridad: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsOptional()
  cargo: string;

  @IsOptional()
  carrera: string;

  @IsOptional()
  foto: string;
}
