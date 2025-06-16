import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Role, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { IPaginatedResponse } from '../common/interfaces/responsePaginate.interface';
import { handleErrors } from '../common/utils/error-handler';
import { IResponse } from '../common/interfaces/response.interface';
import { PaginationDto } from 'src/common/dto/paginationParams.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    pagination: PaginationDto,
  ): Promise<IResponse<IPaginatedResponse<Array<User>>>> {
    try {
      const { offset, limit } = pagination;

      const users = await this.prisma.user.findMany({
        skip: offset,
        take: limit,
      });

      const total = await this.prisma.user.count();

      const response: IPaginatedResponse<User[]> = {
        offset: offset ?? 0,
        limit: limit ?? 10,
        arrayList: users,
        total,
      };

      return {
        success: true,
        data: response,
        error: null,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return handleErrors(error);
      }
      return {
        success: false,
        data: null,
        error: { message: 'An unknown error occurred' },
      } as IResponse<IPaginatedResponse<User[]>>;
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

  async create(createUserDto: CreateUserDto) {
    try {
      // Set default values for optional fields
      const userData: Prisma.UserCreateInput = {
        email: createUserDto.email,
        identification: createUserDto.identification,
        name: createUserDto.name,
        password: createUserDto.password, // Note: In a real app, make sure to hash the password
        photo: createUserDto.photo || '',
        securityWord: createUserDto.securityWord || '',
        role: createUserDto.role || Role.STUDENT,
        position: createUserDto.position || null,
        isActive: true,
      };

      const user = await this.prisma.user.create({
        data: userData,
      });

      return { success: true, data: user, error: null };
    } catch (error) {
      return handleErrors(error);
    }
  }
}
