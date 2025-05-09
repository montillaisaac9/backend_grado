import { Injectable } from '@nestjs/common';
import { UpdateStatDto } from './dto/update-stat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleErrors } from 'src/common/utils/error-handler';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async create() {
    const requestedDate = new Date();

    // Buscar el menú para la semana actual
    const menu = await this.prisma.menu.findFirst({
      where: {
        weekStart: { lte: requestedDate },
        weekEnd: { gte: requestedDate },
      },
      include: {
        menuItems: {
          include: {
            dish: true,
          },
        },
      },
    });
    console.log(menu)
  }

  findAll() {
    return `This action returns all stats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stat`;
  }

  update(id: number, updateStatDto: UpdateStatDto) {
    return `This action updates a #${id} stat`;
  }

  remove(id: number) {
    return `This action removes a #${id} stat`;
  }
}
