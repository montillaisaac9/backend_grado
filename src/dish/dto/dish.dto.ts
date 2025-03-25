import { ApiProperty } from '@nestjs/swagger';

export default class DishDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Ensalada César' })
  title: string;

  @ApiProperty({
    example: 'Ensalada fresca con pollo, lechuga y aderezo césar',
  })
  description: string;

  @ApiProperty({
    example: 85,
    description: 'Porcentaje de calificación basado en las encuestas',
  })
  ratingPercentage?: number;

  @ApiProperty({ example: 120, description: 'Número de votos recibidos' })
  votesCount: number;

  @ApiProperty({ example: 'foto_url.jpg', nullable: true })
  photo: string | null;

  @ApiProperty({
    example: 50.5,
    description: 'Costo del platillo en unidades monetarias',
  })
  cost: number;

  @ApiProperty({ example: 250, description: 'Calorías en kcal' })
  calories: number;

  @ApiProperty({ example: 10.5, description: 'Proteínas en gramos' })
  proteins: number;

  @ApiProperty({ example: 12.3, description: 'Grasas en gramos' })
  fats: number;

  @ApiProperty({ example: 45.0, description: 'Carbohidratos en gramos' })
  carbohydrates: number;
}
