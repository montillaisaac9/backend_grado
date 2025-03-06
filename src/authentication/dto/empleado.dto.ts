import { ApiProperty } from '@nestjs/swagger';
import { CareerDto } from './careerDto.dto';

export class EmployeeDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'profesor@unerg.edu.ve' })
  email: string;

  @ApiProperty({ example: '12345678' })
  identification: string;

  @ApiProperty({ example: 'Juan Pérez' })
  name: string;

  @ApiProperty({ example: 'Docente' })
  position: string;

  @ApiProperty({ type: [CareerDto] })
  careers: CareerDto[];
}
