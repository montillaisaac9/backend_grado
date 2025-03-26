import { PartialType } from '@nestjs/swagger';
import CreateDishRattingDto from './create-dish-ratting.dto';

export class UpdateDishRattingDto extends PartialType(CreateDishRattingDto) {}
