import { IsInt } from 'class-validator';

export default class DishFind {
  @IsInt()
  userId: number;

  @IsInt()
  dishId: number;
}
