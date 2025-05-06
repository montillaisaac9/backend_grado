import { ApiProperty } from '@nestjs/swagger';

export class MenuItemResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2025-03-25T00:00:00Z' })
  date: string;

  @ApiProperty({ example: 'MONDAY' })
  weekDay: string;

  @ApiProperty({ example: 1 })
  dishId: number;

  @ApiProperty({ example: '2025-03-25T12:00:00Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-03-25T12:00:00Z' })
  updatedAt: string;
}

export class MenuDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2025-03-25T00:00:00Z' })
  weekStart: string;

  @ApiProperty({ example: '2025-03-29T00:00:00Z' })
  weekEnd: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-03-20T12:00:00Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-03-20T12:00:00Z' })
  updatedAt: string;

  @ApiProperty({ type: [MenuItemResponseDto] })
  menuItems: MenuItemResponseDto[];
}
