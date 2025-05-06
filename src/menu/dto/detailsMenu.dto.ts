import { ApiProperty } from '@nestjs/swagger';

// DTO para la información básica del plato
export class DishInfoDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Pollo al curry' })
  title: string;

  @ApiProperty({ example: 'Pollo en salsa de curry con arroz basmati' })
  description: string;

  @ApiProperty({ example: 'url-de-la-foto.jpg' })
  photo: string | null;

  @ApiProperty({ example: 0 })
  votesCount: number;

  @ApiProperty({ example: 450 })
  calories: number;

  @ApiProperty({ example: 12.5 })
  cost: number;

  @ApiProperty({ example: 45 })
  carbohydrates: number;

  @ApiProperty({ example: 25 })
  proteins: number;

  @ApiProperty({ example: 15 })
  fats: number;
}

// DTO para cada elemento del menú con información detallada del plato
export class MenuItemDetailDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2025-03-25T00:00:00Z' })
  date: string;

  @ApiProperty({ example: 'MONDAY' })
  weekDay: string;

  @ApiProperty({ type: DishInfoDto })
  dish: DishInfoDto;

  @ApiProperty({ example: '2025-03-25T12:00:00Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-03-25T12:00:00Z' })
  updatedAt: string;
}

// DTO completo para detalles del menú
export class MenuDetailsDto {
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

  @ApiProperty({ type: [MenuItemDetailDto] })
  menuItems: MenuItemDetailDto[];

  // Helper para acceder fácilmente a los platos por día de semana (opcional)
  monday?: DishInfoDto;
  tuesday?: DishInfoDto;
  wednesday?: DishInfoDto;
  thursday?: DishInfoDto;
  friday?: DishInfoDto;
}
