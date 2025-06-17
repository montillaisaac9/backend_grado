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
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PaginationDto } from 'src/common/dto/paginationParams.dto';
import { AuthGuard } from 'src/auth-guard/auth-guard.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  
  
  
  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  
  
  
  @Post('/all')
  findAll(@Body() pagination: PaginationDto) {
    return this.menuService.getAllMenu(pagination);
  }

  /*   
  
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(parseInt(id));
  } */

  
  
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  
  
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }

  @Get('/week')
  weekMenu() {
    return this.menuService.findWeekMenu();
  }
}
