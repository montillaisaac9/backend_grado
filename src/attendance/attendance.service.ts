import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { AttendanceResponseDto } from './dto/attendance.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleErrors } from 'src/common/utils/error-handler';
import { PaginationDto } from 'src/common/dto/paginationParams.dto';
import { validate } from 'class-validator';
import { IPaginatedResponse } from 'src/common/interfaces/responsePaginate.interface';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMenuDto: CreateAttendanceDto): Promise<IResponse<string>> {
    try {
      const newAttendance = await this.prisma.attendance.create({
        data: {
          ...createMenuDto,
        },
      });
      return {
        success: true,
        data: `asitencia creada correctamente`,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors<string>(error);
    }
  }

  async finByMenuId(
    id: number,
    pagination: PaginationDto,
  ): Promise<IResponse<IPaginatedResponse<Array<AttendanceResponseDto>>>> {
    try {
      // Validar el DTO antes de usarlo
      const errors = await validate(pagination);
      if (errors.length > 0) {
        // Si hay errores, se asignan valores predeterminados
        pagination.offset = 0;
        pagination.limit = 10;
      }

      const { offset, limit } = pagination;

      // Obtener el total de registros en la base de datos
      const total = await this.prisma.attendance.count();

      // Obtener los platos con paginación
      const query = await this.prisma.attendance.findMany({
        where: {
          menuItemId: id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              identification: true,
            },
          },
          menuItem: {
            select: {
              id: true,
              date: true,
              weekDay: true,
              dish: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
        skip: offset,
        take: limit,
      });

      // Crear un arreglo de DishDto para devolver la respuesta
      const attendances: AttendanceResponseDto[] = query.map((item) => ({
        id: item.id,
        createdAt: item.createdAt.toISOString(),
        user: {
          id: item.user.id,
          name: item.user.name,
          identification: item.user.identification,
        },
        menuItem: {
          id: item.menuItem.id,
          date: item.menuItem.date.toISOString(),
          weekDay: item.menuItem.weekDay,
          dish: {
            id: item.menuItem.dish.id,
            title: item.menuItem.dish.title,
          },
        },
      }));

      // Estructura de respuesta con paginación
      const response: IPaginatedResponse<Array<AttendanceResponseDto>> = {
        offset: offset ? offset : 0,
        limit: limit ? limit : 10,
        arrayList: attendances,
        total,
      };

      return {
        success: true,
        data: response,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }

  async findByUserId(
    userId: number,
    pagination: PaginationDto,
  ): Promise<IResponse<IPaginatedResponse<Array<AttendanceResponseDto>>>> {
    try {
      // Validar el DTO antes de usarlo
      const errors = await validate(pagination);
      if (errors.length > 0) {
        // Si hay errores, se asignan valores predeterminados
        pagination.offset = 0;
        pagination.limit = 10;
      }

      const { offset, limit } = pagination;

      // Obtener el total de registros para este usuario
      const total = await this.prisma.attendance.count({
        where: {
          userId: userId,
        },
      });

      // Obtener las asistencias del usuario con paginación
      const query = await this.prisma.attendance.findMany({
        where: {
          userId: userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              identification: true,
            },
          },
          menuItem: {
            select: {
              id: true,
              date: true,
              weekDay: true,
              dish: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'desc', // Ordenar por fecha de creación descendente
        },
      });

      // Crear un arreglo de AttendanceResponseDto para devolver la respuesta
      const attendances: AttendanceResponseDto[] = query.map((item) => ({
        id: item.id,
        createdAt: item.createdAt.toISOString(),
        user: {
          id: item.user.id,
          name: item.user.name,
          identification: item.user.identification,
        },
        menuItem: {
          id: item.menuItem.id,
          date: item.menuItem.date.toISOString(),
          weekDay: item.menuItem.weekDay,
          dish: {
            id: item.menuItem.dish.id,
            title: item.menuItem.dish.title,
          },
        },
      }));

      // Estructura de respuesta con paginación
      const response: IPaginatedResponse<Array<AttendanceResponseDto>> = {
        offset: offset ? offset : 0,
        limit: limit ? limit : 10,
        arrayList: attendances,
        total,
      };

      return {
        success: true,
        data: response,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }

  async findByUserAndMenuItem(
    userId: number,
    menuItemId: number,
  ): Promise<IResponse<AttendanceResponseDto | null>> {
    try {
      // Buscar el registro específico por userId y menuItemId
      const attendance = await this.prisma.attendance.findUnique({
        where: {
          userId_menuItemId: {
            userId: userId,
            menuItemId: menuItemId,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              identification: true,
            },
          },
          menuItem: {
            select: {
              id: true,
              date: true,
              weekDay: true,
              dish: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      // Si no se encuentra el registro, retornar null
      if (!attendance) {
        return {
          success: true,
          data: null,
          error: null,
        };
      }

      // Mapear el resultado a AttendanceResponseDto
      const attendanceDto: AttendanceResponseDto = {
        id: attendance.id,
        createdAt: attendance.createdAt.toISOString(),
        user: {
          id: attendance.user.id,
          name: attendance.user.name,
          identification: attendance.user.identification,
        },
        menuItem: {
          id: attendance.menuItem.id,
          date: attendance.menuItem.date.toISOString(),
          weekDay: attendance.menuItem.weekDay,
          dish: {
            id: attendance.menuItem.dish.id,
            title: attendance.menuItem.dish.title,
          },
        },
      };

      return {
        success: true,
        data: attendanceDto,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors<AttendanceResponseDto | null>(error);
    }
  }
}
