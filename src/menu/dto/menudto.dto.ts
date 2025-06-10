import { ApiProperty } from '@nestjs/swagger';

export class DishDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Pollo al curry' })
  title: string;
}

export class MenuItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2025-06-10T00:00:00Z' })
  date: string;

  @ApiProperty({ example: 'MONDAY' })
  weekDay: string;

  @ApiProperty({ type: DishDto })
  dish: DishDto;
}

export class UserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Juan Pérez' })
  name: string;

  @ApiProperty({ example: 'V12345678' })
  identification: string;
}

export class AttendanceResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2025-06-10T14:30:00Z' })
  createdAt: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: MenuItemDto })
  menuItem: MenuItemDto;
}
