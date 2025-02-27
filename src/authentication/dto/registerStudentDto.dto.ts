import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export default class RegisterStudentDto {
  @IsEmail({}, { message: 'El correo no es válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  correo: string;

  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  @IsString({ message: 'La cédula debe ser un texto' })
  cedula: string;

  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre: string;

  @IsNotEmpty({ message: 'La carrera es obligatoria' })
  @IsString({ message: 'La carrera debe ser un texto' })
  carrera: string;

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contraseña: string;

  @IsNotEmpty({ message: 'La palabra de seguridad es obligatoria' })
  @IsString({ message: 'La palabra de seguridad debe ser un texto' })
  palabra_seguridad: string;

  @IsOptional()
  @IsString({ message: 'La foto debe ser una URL válida' })
  foto?: string;
}
