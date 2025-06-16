import { ApiProperty } from '@nestjs/swagger';

export class DishStatsDto {
  @ApiProperty({ example: 1, description: 'ID del plato' })
  id: number;

  @ApiProperty({ example: 'Arroz con Pollo', description: 'Título del plato' })
  title: string;

  @ApiProperty({ example: 'Delicioso arroz con pollo...', description: 'Descripción del plato' })
  description: string;

  @ApiProperty({ example: 350, description: 'Calorías del plato' })
  calories: number;

  @ApiProperty({ example: 12.5, description: 'Costo del plato' })
  cost: number;
}

export class StatsResponseDto {
  @ApiProperty({ example: 1, description: 'ID de la estadística' })
  id: number;

  @ApiProperty({ example: '2025-06-15T00:00:00Z', description: 'Fecha de la estadística' })
  date: string;

  @ApiProperty({ example: 5, description: 'Total de platos diferentes ofrecidos en la fecha' })
  totalDish: number;

  @ApiProperty({ example: 1, description: 'ID del plato más popular' })
  dishId: number;

  @ApiProperty({ example: 120, description: 'Total de asistencias registradas en la fecha' })
  totalAttendance: number;

  @ApiProperty({ example: '2025-06-15T12:30:00Z', description: 'Fecha de creación de la estadística' })
  createdAt: string;

  @ApiProperty({ type: () => DishStatsDto, description: 'Información del plato más popular' })
  dish: DishStatsDto;
}

export class DailyStatsDto {
  @ApiProperty({ example: '2025-06-15', description: 'Fecha de las estadísticas' })
  date: string;

  @ApiProperty({ example: 120, description: 'Total de asistencias del día' })
  totalAttendances: number;

  @ApiProperty({ example: 5, description: 'Total de platos diferentes ofrecidos' })
  totalDishes: number;

  @ApiProperty({ type: () => DishStatsDto, description: 'Plato más popular del día' })
  mostPopularDish: DishStatsDto;

  @ApiProperty({ example: 45, description: 'Asistencias al plato más popular' })
  mostPopularDishAttendances: number;
}
