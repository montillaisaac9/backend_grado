import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DishRattingService } from './dish-ratting.service';
import CreateDishRattingDto from './dto/create-dish-ratting.dto';
import { UpdateDishRattingDto } from './dto/update-dish-ratting.dto';
import { PaginationDto } from 'src/common/dto/paginationParams.dto';
import { AuthGuard } from 'src/auth-guard/auth-guard.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('dish-ratting')
export class DishRattingController {
  constructor(private readonly dishRattingService: DishRattingService) {}

  @Post()
  create(@Body() createDishRattingDto: CreateDishRattingDto) {
    return this.dishRattingService.create(createDishRattingDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Roles(Role.EMPLOYEE)
  @Post('/:id')
  finByMenuId(@Param('id') id: string, @Body() pagination: PaginationDto) {
    return this.dishRattingService.findAllByDish(parseInt(id), pagination);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Roles(Role.EMPLOYEE)
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

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Roles(Role.EMPLOYEE)
  @Get('/dish:id')
  findByDish(@Param('id') id: string) {
    return this.dishRattingService.getAverageRating(+id);
  }
}
