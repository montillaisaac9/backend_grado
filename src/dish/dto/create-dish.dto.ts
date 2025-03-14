import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

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
}
