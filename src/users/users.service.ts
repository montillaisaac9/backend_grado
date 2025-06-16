import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleErrors } from 'src/common/utils/error-handler';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      return { success: true, data: users, error: null };
    } catch (error) {
      return handleErrors(error);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            message: 'User not found',
          },
        };
      }
      return { success: true, data: user, error: null };
    } catch (error) {
      return handleErrors(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      return { success: true, data: updatedUser, error: null };
    } catch (error) {
      return handleErrors(error);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.user.delete({ where: { id } });
      return { success: true, data: null, error: null };
    } catch (error) {
      return handleErrors(error);
    }
  }
}
