import { Injectable } from '@nestjs/common';
import { UpdateStatDto } from './dto/update-stat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleErrors } from 'src/common/utils/error-handler';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async create() {
    try {
      const requestedDate = new Date();

      const menu = await this.prisma.menu.findFirst({
        where: {
          weekStart: { lte: requestedDate },
          weekEnd: { gte: requestedDate },
        },
        include: {
          monday: {
            select: {
              id: true,
            },
          },
          tuesday: {
            select: {
              id: true,
            },
          },
          wednesday: {
            select: {
              id: true,
            },
          },
          thursday: {
            select: {
              id: true,
            },
          },
          friday: {
            select: {
              id: true,
            },
          },
        },
      });
      console.log(menu);
    } catch (error: unknown) {
      return handleErrors(error);
    }
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
