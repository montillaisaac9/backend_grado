import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CariersService } from './cariers.service';
import { CreateCareerDto } from './dto/create-carier.dto';
import { UpdateCarierDto } from './dto/update-carier.dto';
import { AuthGuard } from 'src/auth-guard/auth-guard.guard';
import { PaginationDto } from 'src/common/dto/paginationParams.dto';

@Controller('carriers')
export class CariersController {
  constructor(private readonly cariersService: CariersService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCarierDto: CreateCareerDto) {
    return this.cariersService.create(createCarierDto);
  }

  @Post('/all')
  async findAll(@Body() pagination: PaginationDto) {
    return this.cariersService.findAll(pagination);
  }

  @Get('/active')
  findActive() {
    return this.cariersService.findActive();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cariersService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarierDto: UpdateCarierDto) {
    return this.cariersService.update(+id, updateCarierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cariersService.remove(+id);
  }
}
