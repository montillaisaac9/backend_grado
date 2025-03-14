import { Injectable } from '@nestjs/common';
import CreateDishDto from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import DishDto from './dto/dish.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { handleErrors } from 'src/common/utils/error-handler';

@Injectable()
export class DishService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    registro: CreateDishDto,
    url: string,
  ): Promise<IResponse<DishDto>> {
    // Crear el plato en la base de datos
    const newDish = await this.prisma.dish.create({
      data: {
        title: registro.title,
        description: registro.description,
        photo: `http://localhost:3000/${url}`,
      },
    });

    // Crear un objeto DishDto para devolver la respuesta
    const dish: DishDto = {
      id: newDish.id,
      title: newDish.title,
      description: newDish.description,
      photo: newDish.photo,
      votesCount: 0,
    };

    // Retornar el objeto con la estructura de la interfaz IResponse
    return {
      success: true,
      data: dish,
      error: null,
    };
  }
  catch(error: unknown) {
    // Manejo de errores en caso de que algo falle
    return handleErrors(error);
  }

  findAll() {
    return `This action returns all dish`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dish`;
  }

  update(id: number, updateDishDto: UpdateDishDto) {
    return `This action updates a #${updateDishDto.title} dish`;
  }

  remove(id: number) {
    return `This action removes a #${id} dish`;
  }
}
