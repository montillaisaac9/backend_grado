import { IsNotEmpty, IsBoolean, IsDateString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ example: '2025-03-25T00:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  weekStart: string; // Fecha de inicio de la semana

  @ApiProperty({ example: '2025-03-29T00:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  weekEnd: string; // Fecha de fin de la semana

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean; // Estado activo/inactivo del menú

  // Platos asignados a cada día de la semana
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  mondayId: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsInt()
  tuesdayId: number;

  @ApiProperty({ example: 3 })
  @IsNotEmpty()
  @IsInt()
  wednesdayId: number;

  @ApiProperty({ example: 4 })
  @IsNotEmpty()
  @IsInt()
  thursdayId: number;

  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @IsInt()
  fridayId: number;
}
