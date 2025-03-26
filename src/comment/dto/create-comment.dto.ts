import { IsInt, IsString } from 'class-validator';

export default class CreateCommentDto {
  @IsString()
  text: string;

  @IsInt()
  userId: number;

  @IsInt()
  dishId: number;
}
