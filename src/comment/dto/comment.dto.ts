import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class CommentDto {
  @IsInt()
  id: number;

  @IsString()
  text: string;

  @IsInt()
  userId: number;

  @IsInt()
  dishId: number;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @Type(() => UserDto)
  @IsOptional()
  user?: UserDto;
}

export class UserDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  email: string;
}
