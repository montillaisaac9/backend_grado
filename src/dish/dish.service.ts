import { Injectable } from '@nestjs/common';
import CreateDishDto from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DishDto, DishSelectDto } from './dto/dish.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { handleErrors } from 'src/common/utils/error-handler';
import { PaginationDto } from 'src/common/dto/paginationParams.dto';
import { validate } from 'class-validator';
import { IPaginatedResponse } from 'src/common/interfaces/responsePaginate.interface';

@Injectable()
export class DishService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    registro: CreateDishDto,
    url: string | undefined = undefined,
  ): Promise<IResponse<DishDto>> {
    try {
      // Crear un nuevo plato en la base de datos
      const newDish = await this.prisma.dish.create({
        data: {
          title: registro.title,
          description: registro.description,
          photo: url ? `http://localhost:3000/${url}` : undefined,
          cost: parseFloat(registro.cost.toString()),
          calories: parseInt(registro.calories.toString()),
          carbohydrates: parseFloat(registro.carbohydrates.toString()),
          proteins: parseFloat(registro.proteins.toString()),
          fats: parseFloat(registro.fats.toString()),
        },
      });

      // Crear un objeto DishDto para devolver la respuesta
      const dish: DishDto = {
        id: newDish.id,
        title: newDish.title,
        description: newDish.description,
        photo: newDish.photo,
        votesCount: 0,
        calories: newDish.calories,
        cost: newDish.cost,
        carbohydrates: newDish.carbohydrates,
        proteins: newDish.proteins,
        fats: newDish.fats,
      };

      // Retornar el objeto con la estructura de la interfaz IResponse
      return {
        success: true,
        data: dish,
        error: null,
      };
    } catch (error: unknown) {
      // Manejo de errores en caso de que algo falle
      return handleErrors<any>(error);
    }
  }

  async getAllDish(
    pagination: PaginationDto,
  ): Promise<IResponse<IPaginatedResponse<Array<DishDto>>>> {
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
      const total = await this.prisma.dish.count();

      // Obtener los platos con paginación
      const dishes = await this.prisma.dish.findMany({
        skip: offset,
        take: limit,
      });

      // Crear un arreglo de DishDto para devolver la respuesta
      const dishesDto: Array<DishDto> = dishes.map((dish) => ({
        id: dish.id,
        title: dish.title,
        description: dish.description,
        photo: dish.photo,
        votesCount: 0,
        calories: dish.calories,
        cost: dish.cost,
        carbohydrates: dish.carbohydrates,
        proteins: dish.proteins,
        fats: dish.fats,
      }));

      // Estructura de respuesta con paginación
      const response: IPaginatedResponse<Array<DishDto>> = {
        offset: offset ? offset : 0,
        limit: limit ? limit : 10,
        arrayList: dishesDto,
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

  async findActive(): Promise<IResponse<Array<DishSelectDto>>> {
    try {
      const dishes = await this.prisma.dish.findMany({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
        },
      });
      const dishesArray: Array<DishSelectDto> = dishes.map((dish) => ({
        id: dish.id,
        title: dish.title,
      }));
      return {
        success: true,
        data: dishesArray,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors<DishSelectDto[]>(error);
    }
  }
  async findOne(id: number): Promise<IResponse<DishDto>> {
    try {
      const dish = await this.prisma.dish.findUnique({
        where: { id },
      });

      // Si no se encuentra el plato, devolver un error en formato IErrorResponse
      if (!dish) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/dishes/${id}`,
            message: `El plato con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Convertir el resultado en un objeto `DishDto`
      const dishDto: DishDto = {
        id: dish.id,
        title: dish.title,
        description: dish.description,
        photo: dish.photo,
        votesCount: 0,
        calories: dish.calories,
        cost: dish.cost,
        carbohydrates: dish.carbohydrates,
        proteins: dish.proteins,
        fats: dish.fats,
      };

      // Retornar el objeto con la estructura de `IResponse`
      return {
        success: true,
        data: dishDto,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }

  async update(
    id: number,
    url: string | undefined = undefined,
    updateDishDto: UpdateDishDto,
  ): Promise<IResponse<DishDto>> {
    try {
      // Verificar si el plato existe
      const existingDish = await this.prisma.dish.findUnique({ where: { id } });

      if (!existingDish) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/dishes/${id}`,
            message: `El plato con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Actualizar el plato
      const updatedDish = await this.prisma.dish.update({
        where: { id },
        data: {
          title: updateDishDto.title,
          description: updateDishDto.description,
          photo: url ? `http://localhost:3000/${url}` : undefined,
          cost: parseFloat((updateDishDto.cost ?? 0.0).toString()),
          calories: parseInt((updateDishDto.calories ?? 0).toString()),
          carbohydrates: parseFloat(
            (updateDishDto.carbohydrates ?? 0).toString(),
          ),
          proteins: parseFloat((updateDishDto.proteins ?? 0).toString()),
          fats: parseFloat((updateDishDto.fats ?? 0).toString()),
        },
      });

      // Retornar la respuesta con `IResponse`
      return {
        success: true,
        data: {
          id: updatedDish.id,
          title: updatedDish.title,
          description: updatedDish.description,
          photo: updatedDish.photo,
          votesCount: 0, // Si tienes un campo real, reemplázalo
          calories: updatedDish.calories,
          cost: updatedDish.cost,
          carbohydrates: updatedDish.carbohydrates,
          proteins: updatedDish.proteins,
          fats: updatedDish.fats,
        },
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }

  async remove(id: number): Promise<IResponse<String>> {
    try {
      // Verificar si el plato existe
      const existingDish = await this.prisma.dish.findUnique({ where: { id } });

      if (!existingDish) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/dishes/${id}`,
            message: `El plato con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Eliminar el plato
      await this.prisma.dish.delete({ where: { id } });

      // Retornar una respuesta exitosa
      return {
        success: true,
        data: 'El plato fue eliminado correctamente',
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }
}
