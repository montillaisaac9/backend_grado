import { IsInt, IsNumber, Max, Min } from 'class-validator';

export default class CreateDishRatingDto {
  @IsInt()
  userId: number;

  @IsInt()
  dishId: number;

  @IsInt()
  statsId: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
