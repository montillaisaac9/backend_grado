import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CariersService } from './cariers.service';
import { CreateCareerDto } from './dto/create-carier.dto';
import { UpdateCarierDto } from './dto/update-carier.dto';

@Controller('cariers')
export class CariersController {
  constructor(private readonly cariersService: CariersService) {}

  @Post()
  create(@Body() createCarierDto: CreateCareerDto) {
    return this.cariersService.create(createCarierDto);
  }

  @Get()
  findAll() {
    return this.cariersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cariersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarierDto: UpdateCarierDto) {
    return this.cariersService.update(+id, updateCarierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cariersService.remove(+id);
  }
}
