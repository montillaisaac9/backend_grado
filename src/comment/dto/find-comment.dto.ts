import { IsInt } from 'class-validator';

export default class CommentFind {
  @IsInt()
  userId: number;

  @IsInt()
  dishId: number;
}
