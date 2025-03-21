import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export default class CreateStudentDto {
  @ApiProperty({
    example: 'student@example.com',
    description: 'Valid email address',
  })
  @IsEmail({}, { message: 'El correo no es válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'Unique identification number',
  })
  @IsNotEmpty({ message: 'La cédula es obligatoria' })
  @IsString({ message: 'La cédula debe ser un texto' })
  identification: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Full name of the student',
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  name: string;

  @IsArray({ message: 'Career IDs must be an array' })
  @ArrayNotEmpty({ message: 'Career list cannot be empty' })
  @IsNumber({}, { each: true, message: 'Each career ID must be a number' })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  careerIds: number[];

  @ApiProperty({
    example: 'securePassword123',
    description: 'User password, min length 6',
  })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({
    example: 'mothermaidenname',
    description: 'Security word for recovery',
  })
  @IsNotEmpty({ message: 'La palabra de seguridad es obligatoria' })
  @IsString({ message: 'La palabra de seguridad debe ser un texto' })
  securityWord: string;

  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    description: 'Profile photo URL',
    required: false,
  })
  @IsOptional()
  Image?: Express.Multer.File;
}
