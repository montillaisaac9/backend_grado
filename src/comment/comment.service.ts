import { Injectable } from '@nestjs/common';
import CreateCommentDto from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IResponse } from 'src/common/interfaces/response.interface';
import { handleErrors } from 'src/common/utils/error-handler';
import { CommentDto } from './dto/comment.dto';
import { PaginationDto } from 'src/common/dto/paginationParams.dto';
import { IPaginatedResponse } from 'src/common/interfaces/responsePaginate.interface';
import { validate } from 'class-validator';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto): Promise<IResponse<string>> {
    try {
      const comment = await this.prisma.comment.create({
        data: {
          ...createCommentDto,
        },
      });
      return {
        success: true,
        data: `comentado creado correctamente comentado.id: ${comment.id}`,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors<string>(error);
    }
  }

  async findAll(
    id: number,
    pagination: PaginationDto,
  ): Promise<IResponse<IPaginatedResponse<Array<CommentDto>>>> {
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
      const total = await this.prisma.comment.count();

      // Obtener los platos con paginación
      const query = await this.prisma.comment.findMany({
        where: {
          dishId: id,
        },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        skip: offset,
        take: limit,
      });

      console.log(query);

      // Crear un arreglo de DishDto para devolver la respuesta
      const commetsArray: Array<CommentDto> = query.map((com) => ({
        id: com.id,
        text: com.text,
        userId: com.userId,
        dishId: com.dishId,
        createdAt: com.createdAt,
        user: com.user
          ? {
              id: com.user.id,
              name: com.user.name,
              email: com.user.email,
            }
          : undefined,
      }));

      // Estructura de respuesta con paginación
      const response: IPaginatedResponse<Array<CommentDto>> = {
        offset: offset ? offset : 0,
        limit: limit ? limit : 10,
        arrayList: commetsArray,
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

  async findOne(id: number): Promise<IResponse<CommentDto>> {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      // Si no se encuentra el plato, devolver un error en formato IErrorResponse
      if (!comment) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/comment/${id}`,
            message: `El comentario con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Convertir el resultado en un objeto `DishDto`
      const CommentDto: CommentDto = {
        id: comment.id,
        text: comment.text,
        userId: comment.userId,
        dishId: comment.dishId,
        createdAt: comment.createdAt,
        user: comment.user
          ? {
              id: comment.user.id,
              name: comment.user.name,
              email: comment.user.email,
            }
          : undefined,
      };

      // Retornar el objeto con la estructura de `IResponse`
      return {
        success: true,
        data: CommentDto,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }

  async update(
    id: number,
    updateDishDto: UpdateCommentDto,
  ): Promise<IResponse<CommentDto>> {
    try {
      // Verificar si el plato existe
      const existingDish = await this.prisma.comment.findUnique({
        where: { id },
      });

      if (!existingDish) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/comment/${id}`,
            message: `El commentario con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Actualizar el plato
      const updatedDish = await this.prisma.comment.update({
        where: { id },
        data: {
          ...updateDishDto,
        },
      });

      // Retornar la respuesta con `IResponse`
      return {
        success: true,
        data: {
          id: updatedDish.id,
          text: updatedDish.text,
          userId: updatedDish.userId,
          dishId: updatedDish.dishId,
          createdAt: updatedDish.createdAt,
        },
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }

  async remove(id: number): Promise<IResponse<null>> {
    try {
      // Verificar si el plato existe
      const existingDish = await this.prisma.comment.findUnique({
        where: { id },
      });

      if (!existingDish) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/comment/${id}`,
            message: `El commentario con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Eliminar el plato
      await this.prisma.comment.delete({ where: { id } });

      // Retornar una respuesta exitosa
      return {
        success: true,
        data: null,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }
}
