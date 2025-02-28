import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export default class RegisterEmployeeDto {
  @IsEmail({}, { message: 'The email is not valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Identification is required' })
  @IsString({ message: 'Identification must be a string' })
  identification: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Security word is required' })
  securityWord: string;

  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  // Removemos @IsOptional() para que coincida con Prisma
  @IsNotEmpty({ message: 'Position is required' })
  position: string;
}
