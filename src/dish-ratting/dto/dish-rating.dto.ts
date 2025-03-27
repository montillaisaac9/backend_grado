import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export default class DishRatingDto {
  @IsInt()
  id: number;

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
