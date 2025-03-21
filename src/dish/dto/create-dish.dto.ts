import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsNumber,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

// DTO para la creación de un Dish
export default class CreateDishDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  photo?: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(String(value).trim()))
  @IsNumber()
  @Min(0)
  cost: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(String(value).trim()))
  @IsNumber()
  @Min(0)
  calories: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(String(value).trim()))
  @IsNumber()
  @Min(0)
  proteins: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(String(value).trim()))
  @IsNumber()
  @Min(0)
  fats: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(String(value).trim()))
  @IsNumber()
  @Min(0)
  carbohydrates: number;
}
