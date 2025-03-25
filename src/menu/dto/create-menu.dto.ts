import {
  IsNotEmpty,
  IsBoolean,
  IsDateString,
  IsArray,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ example: '2025-03-25T00:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean; // Estado activo/inactivo del menú

  @ApiProperty({ example: [1, 2, 3] })
  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  menuIds: number[];
}
