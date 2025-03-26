import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DishRattingService } from './dish-ratting.service';
import CreateDishRattingDto from './dto/create-dish-ratting.dto';
import { UpdateDishRattingDto } from './dto/update-dish-ratting.dto';

@Controller('dish-ratting')
export class DishRattingController {
  constructor(private readonly dishRattingService: DishRattingService) {}

  @Post()
  create(@Body() createDishRattingDto: CreateDishRattingDto) {
    return this.dishRattingService.create(createDishRattingDto);
  }

  @Get()
  findAll() {
    return this.dishRattingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dishRattingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDishRattingDto: UpdateDishRattingDto,
  ) {
    return this.dishRattingService.update(+id, updateDishRattingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dishRattingService.remove(+id);
  }
}
