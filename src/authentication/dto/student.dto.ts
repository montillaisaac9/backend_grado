import { ApiProperty } from '@nestjs/swagger';
import { CareerDto } from './careerDto.dto';

export class StudentDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 'estudiante@unerg.edu.ve' })
  email: string;

  @ApiProperty({ example: '87654321' })
  identification: string;

  @ApiProperty({ example: 'María González' })
  name: string;

  @ApiProperty({ example: 'foto_url.jpg' })
  photo: string | null;

  @ApiProperty({ type: [CareerDto] })
  careers: CareerDto[];
}
