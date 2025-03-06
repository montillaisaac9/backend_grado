import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class RegisterEmployeeDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Valid email address',
  })
  @IsEmail({}, { message: 'The email is not valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'Unique identification number',
  })
  @IsNotEmpty({ message: 'Identification is required' })
  @IsString({ message: 'Identification must be a string' })
  identification: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'User password, min length 6',
  })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({
    example: 'mothermaidenname',
    description: 'Security word for recovery',
  })
  @IsNotEmpty({ message: 'Security word is required' })
  securityWord: string;

  @ApiProperty({ example: [1, 2], description: 'Array of career IDs' })
  @IsNotEmpty({ message: 'At least one career is required' })
  @IsArray({ message: 'Career IDs must be an array' })
  @ArrayNotEmpty({ message: 'Career list cannot be empty' })
  @IsNumber({}, { each: true, message: 'Each career ID must be a number' })
  careerIds: number[];

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the employee',
  })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ example: 'Manager', description: 'Position of the employee' })
  @IsNotEmpty({ message: 'Position is required' })
  position: string;
}
