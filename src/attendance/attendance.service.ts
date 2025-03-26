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
        data: `asitencia creada correctamente attendance.id: ${newAttendance.id}`,
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
          menuId: id,
        },
        include: {
          user: { select: { id: true, name: true, identification: true } },
        },
        skip: offset,
        take: limit,
      });

      // Crear un arreglo de DishDto para devolver la respuesta
      const attendances: Array<AttendanceResponseDto> = query.map((att) => ({
        id: att.id,
        userId: att.userId,
        menuId: att.menuId,
        createdAt: att.createdAt,
        user: att.user,
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
}
