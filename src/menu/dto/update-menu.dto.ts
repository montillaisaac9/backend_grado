import {
  IsOptional,
  IsBoolean,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { MenuItemDto } from './create-menu.dto';

export class UpdateMenuDto {
  @ApiProperty({ example: '2025-03-25T00:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  weekStart?: string;

  @ApiProperty({ example: '2025-03-29T00:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  weekEnd?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    type: [MenuItemDto],
    required: false,
    example: [
      { date: '2025-03-25T00:00:00Z', weekDay: 'MONDAY', dishId: 1 },
      { date: '2025-03-26T00:00:00Z', weekDay: 'TUESDAY', dishId: 2 },
      { date: '2025-03-27T00:00:00Z', weekDay: 'WEDNESDAY', dishId: 3 },
      { date: '2025-03-28T00:00:00Z', weekDay: 'THURSDAY', dishId: 4 },
      { date: '2025-03-29T00:00:00Z', weekDay: 'FRIDAY', dishId: 5 },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  menuItems?: MenuItemDto[];
}
