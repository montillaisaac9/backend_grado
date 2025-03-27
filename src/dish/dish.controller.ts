import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { DishService } from './dish.service';
import CreateDishDto from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/common/dto/paginationParams.dto';
import { AuthGuard } from 'src/auth-guard/auth-guard.guard';

@UseGuards(AuthGuard)
@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createDishDto: CreateDishDto,
    @UploadedFile() image: Express.Multer.File | undefined,
  ) {
    return this.dishService.create(
      createDishDto,
      image ? image.path : undefined,
    );
  }

  @Post('/all')
  findAll(@Body() pagination: PaginationDto) {
    return this.dishService.getAllDish(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dishService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
    return this.dishService.update(+id, updateDishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dishService.remove(+id);
  }
}
