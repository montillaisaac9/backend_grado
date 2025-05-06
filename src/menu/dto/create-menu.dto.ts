import {
  IsNotEmpty,
  IsDateString,
  IsBoolean,
  IsInt,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// DTO para cada elemento del menú (plato asignado a un día específico)
export class MenuItemDto {
  @ApiProperty({ example: '2025-03-25T00:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  date: string; // Fecha específica del día

  @ApiProperty({
    example: 'MONDAY',
    enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
  })
  @IsNotEmpty()
  weekDay: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY'; // Día de la semana como enum

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  dishId: number; // ID del plato asignado a este día
}

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

  @ApiProperty({
    type: [MenuItemDto],
    example: [
      { date: '2025-03-25T00:00:00Z', weekDay: 'MONDAY', dishId: 1 },
      { date: '2025-03-26T00:00:00Z', weekDay: 'TUESDAY', dishId: 2 },
      { date: '2025-03-27T00:00:00Z', weekDay: 'WEDNESDAY', dishId: 3 },
      { date: '2025-03-28T00:00:00Z', weekDay: 'THURSDAY', dishId: 4 },
      { date: '2025-03-29T00:00:00Z', weekDay: 'FRIDAY', dishId: 5 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  menuItems: MenuItemDto[]; // Lista de elementos del menú (platos por día)
}
