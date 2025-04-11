import {
  IsNotEmpty,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DishDto } from 'src/dish/dto/dish.dto';

export class MenuDetailsDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({ example: '2025-03-24T00:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  weekStart: string;

  @ApiProperty({ example: '2025-03-28T23:59:59Z' })
  @IsNotEmpty()
  @IsDateString()
  weekEnd: string;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: '2025-03-24T00:00:00Z' })
  @IsOptional()
  createdAt: string;

  @ApiProperty({ example: '2025-03-28T23:59:59Z' })
  @IsOptional()
  updatedAt: string;

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

  // Propiedades de las relaciones
  monday: DishDto;
  tuesday: DishDto;
  wednesday: DishDto;
  thursday: DishDto;
  friday: DishDto;
}
