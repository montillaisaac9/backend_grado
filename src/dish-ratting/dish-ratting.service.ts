import { Injectable } from '@nestjs/common';
import CreateDishRattingDto from './dto/create-dish-ratting.dto';
import { UpdateDishRattingDto } from './dto/update-dish-ratting.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IResponse } from 'src/common/interfaces/response.interface';
import { handleErrors } from 'src/common/utils/error-handler';
import { PaginationDto } from 'src/common/dto/paginationParams.dto';
import { IPaginatedResponse } from 'src/common/interfaces/responsePaginate.interface';
import DishRatingDto from './dto/dish-rating.dto';
import { validate } from 'class-validator';

@Injectable()
export class DishRattingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createDishRattingDto: CreateDishRattingDto,
  ): Promise<IResponse<string>> {
    try {
      const comment = await this.prisma.dishRating.create({
        data: {
          ...createDishRattingDto,
        },
      });
      return {
        success: true,
        data: `puntuacion subida correctamente comentado.id: ${comment.id}`,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors<string>(error);
    }
  }

  async findAllByDish(
    id: number,
    pagination: PaginationDto,
  ): Promise<IResponse<IPaginatedResponse<Array<DishRatingDto>>>> {
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
      const query = await this.prisma.dishRating.findMany({
        where: {
          dishId: id, // Assuming `id` is the unique identifier for the dish rating
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
      const dishArray: Array<DishRatingDto> = query.map((com) => ({
        id: com.id,
        rating: com.rating,
        userId: com.userId,
        dishId: com.dishId,
        statsId: com.statsId,
        createdAt: com.createdAt,
        user: {
          id: com.user.id,
          name: com.user.name,
          email: com.user.email,
        },
      }));

      // Estructura de respuesta con paginación
      const response: IPaginatedResponse<Array<DishRatingDto>> = {
        offset: offset ? offset : 0,
        limit: limit ? limit : 10,
        arrayList: dishArray,
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

  async findOne(id: number): Promise<IResponse<DishRatingDto>> {
    try {
      const dishRatingEntity = await this.prisma.dishRating.findFirst({
        where: {
          dishId: id, // Assuming `id` is the unique identifier for the dish rating
        },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      // Si no se encuentra el plato, devolver un error en formato IErrorResponse
      if (!dishRatingEntity) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/dish-rating/${id}`,
            message: `la puntuacion del plato con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Convertir el resultado en un objeto `DishDto`
      const dishRating: DishRatingDto = {
        id: dishRatingEntity.id,
        rating: dishRatingEntity.rating,
        userId: dishRatingEntity.userId,
        dishId: dishRatingEntity.dishId,
        statsId: dishRatingEntity.statsId,
        createdAt: dishRatingEntity.createdAt,
        user: {
          id: dishRatingEntity.user.id,
          name: dishRatingEntity.user.name,
          email: dishRatingEntity.user.email,
        },
      };

      // Retornar el objeto con la estructura de `IResponse`
      return {
        success: true,
        data: dishRating,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }

  async update(
    id: number,
    updateDishRattingDto: UpdateDishRattingDto,
  ): Promise<IResponse<DishRatingDto>> {
    try {
      // Verificar si el plato existe
      const existingDish = await this.prisma.dishRating.findUnique({
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
      const updatedDish = await this.prisma.dishRating.update({
        where: { id },
        data: {
          ...updateDishRattingDto,
        },
      });

      // Retornar la respuesta con `IResponse`
      return {
        success: true,
        data: {
          id: updatedDish.id,
          rating: updatedDish.rating,
          userId: updatedDish.userId,
          dishId: updatedDish.dishId,
          statsId: updatedDish.statsId,
          createdAt: updatedDish.createdAt,
        },
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }
}
