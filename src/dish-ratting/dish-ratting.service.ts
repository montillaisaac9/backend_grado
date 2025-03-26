import { Injectable } from '@nestjs/common';
import CreateDishRattingDto from './dto/create-dish-ratting.dto';
import { UpdateDishRattingDto } from './dto/update-dish-ratting.dto';

@Injectable()
export class DishRattingService {
  create(createDishRattingDto: CreateDishRattingDto) {
    return 'This action adds a new dishRatting';
  }

  findAll() {
    return `This action returns all dishRatting`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dishRatting`;
  }

  update(id: number, updateDishRattingDto: UpdateDishRattingDto) {
    return `This action updates a #${id} dishRatting`;
  }

  remove(id: number) {
    return `This action removes a #${id} dishRatting`;
  }
}
