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

// This DTO represents the structure of menu items as used within MenuDto in menu.service.ts
export class SimpleMenuItemDto {
  @ApiProperty({ example: 1, description: 'ID of the menu item' })
  id: number;

  @ApiProperty({ example: '2025-06-10T00:00:00Z', description: 'Date of the menu item' })
  date: string; // ISOString

  @ApiProperty({ example: 'MONDAY', description: 'Day of the week for the menu item' })
  weekDay: string;

  @ApiProperty({ example: 1, description: 'ID of the associated dish' })
  dishId: number;

  @ApiProperty({ example: '2025-06-10T14:30:00Z', description: 'Creation timestamp' })
  createdAt: string; // ISOString

  @ApiProperty({ example: '2025-06-10T15:00:00Z', description: 'Last update timestamp' })
  updatedAt: string; // ISOString
}

export class MenuDto {
  @ApiProperty({ example: 1, description: 'ID of the menu' })
  id: number;

  @ApiProperty({ example: '2025-06-09T00:00:00Z', description: 'Start date of the menu week' })
  weekStart: string; // ISOString

  @ApiProperty({ example: '2025-06-15T23:59:59Z', description: 'End date of the menu week' })
  weekEnd: string; // ISOString

  @ApiProperty({ example: true, description: 'Whether the menu is active' })
  isActive: boolean;

  @ApiProperty({ example: '2025-06-08T10:00:00Z', description: 'Creation timestamp' })
  createdAt: string; // ISOString

  @ApiProperty({ example: '2025-06-08T11:00:00Z', description: 'Last update timestamp' })
  updatedAt: string; // ISOString

  @ApiProperty({ type: () => [SimpleMenuItemDto], description: 'List of items in the menu' })
  menuItems: SimpleMenuItemDto[];
}