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

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Roles(Role.EMPLOYEE)
  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Roles(Role.EMPLOYEE)
  @Post('/all')
  findAll(@Body() pagination: PaginationDto) {
    return this.menuService.getAllMenu(pagination);
  }

  /*   @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Roles(Role.EMPLOYEE)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(parseInt(id));
  } */

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Roles(Role.EMPLOYEE)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Roles(Role.EMPLOYEE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }

  @Get('/week')
  weekMenu() {
    return this.menuService.findWeekMenu();
  }
}
