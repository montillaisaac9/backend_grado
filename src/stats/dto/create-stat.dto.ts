import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class CreateStatDto {
  @ApiProperty({ 
    example: '2025-06-15', 
    description: 'Fecha para generar estadísticas (formato YYYY-MM-DD). Si no se proporciona, se usa la fecha actual',
    required: false
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
