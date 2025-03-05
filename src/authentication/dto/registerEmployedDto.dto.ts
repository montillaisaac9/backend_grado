import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
} from 'class-validator';

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

  @IsNotEmpty({ message: 'At least one career is required' })
  @IsArray({ message: 'Career IDs must be an array' })
  @ArrayNotEmpty({ message: 'Career list cannot be empty' })
  @IsNumber({}, { each: true, message: 'Each career ID must be a number' })
  careerIds: number[];

  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Position is required' })
  position: string;
}
