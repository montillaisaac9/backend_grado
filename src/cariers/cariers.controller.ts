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
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from '@prisma/client';


@Controller('carriers')
export class CariersController {
  constructor(private readonly cariersService: CariersService) {}

  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Roles(Role.EMPLOYEE)
  @Post()
  create(@Body() createCarierDto: CreateCareerDto) {
    return this.cariersService.create(createCarierDto);
  }

  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Roles(Role.EMPLOYEE)
  @Get()
  findAll() {
    return this.cariersService.findAll();
  }

  @Get('/active')
  findActive() {
    return this.cariersService.findActive();
  }

  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Roles(Role.EMPLOYEE)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cariersService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Roles(Role.EMPLOYEE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarierDto: UpdateCarierDto) {
    return this.cariersService.update(+id, updateCarierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cariersService.remove(+id);
  }
}