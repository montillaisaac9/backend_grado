import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleErrors } from 'src/common/utils/error-handler';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    try {
      const newMenu = await this.prisma.menu.create({
        data: {
          date: createMenuDto.date,
          isActive: createMenuDto.isActive,
        },
      });

      await this.prisma.menuItem.createMany({
        data: createMenuDto.menuIds.map((id) => ({
          menuId: newMenu.id,
          dishId: id,
        })),
      });

      return {
        success: true,
        data: newMenu,
        error: null,
      };
    } catch (error: unknown) {
      handleErrors<any>(error);
    }
  }

  findAll() {
    return `This action returns all menu`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
