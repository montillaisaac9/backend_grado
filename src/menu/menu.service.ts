import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleErrors } from 'src/common/utils/error-handler';
import { IResponse } from 'src/common/interfaces/response.interface';
import { PaginationDto } from 'src/common/dto/paginationParams.dto';
import { IPaginatedResponse } from 'src/common/interfaces/responsePaginate.interface';
import { MenuDto } from './dto/menudto.dto';
import { validate } from 'class-validator';
import { MenuDetailsDto } from './dto/detailsMenu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto): Promise<IResponse<string>> {
    try {
      const newMenu = await this.prisma.menu.create({
        data: {
          weekStart: new Date(createMenuDto.weekStart),
          weekEnd: new Date(createMenuDto.weekEnd),
          isActive: createMenuDto.isActive,
          mondayId: createMenuDto.mondayId,
          tuesdayId: createMenuDto.tuesdayId,
          wednesdayId: createMenuDto.wednesdayId,
          thursdayId: createMenuDto.thursdayId,
          fridayId: createMenuDto.fridayId,
        },
      });
      return {
        success: true,
        data: `Menu creado correctamente newMenu.id: ${newMenu.id}`,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors<string>(error);
    }
  }

  async getAllMenu(
    pagination: PaginationDto,
  ): Promise<IResponse<IPaginatedResponse<Array<MenuDto>>>> {
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
      const total = await this.prisma.menu.count();

      // Obtener los platos con paginación
      const menus = await this.prisma.menu.findMany({
        skip: offset,
        take: limit,
      });

      // Crear un arreglo de MenuDto para devolver la respuesta
      const menusDto: Array<MenuDto> = menus.map((menu) => ({
        id: menu.id,
        weekStart: menu.weekStart.toISOString(),
        weekEnd: menu.weekEnd.toISOString(),
        isActive: menu.isActive,
        createdAt: menu.createdAt.toISOString(),
        updatedAt: menu.updatedAt.toISOString(),
        mondayId: menu.mondayId,
        tuesdayId: menu.tuesdayId,
        wednesdayId: menu.wednesdayId,
        thursdayId: menu.thursdayId,
        fridayId: menu.fridayId,
      }));

      // Estructura de respuesta con paginación
      const response: IPaginatedResponse<Array<MenuDto>> = {
        offset: offset ? offset : 0,
        limit: limit ? limit : 10,
        arrayList: menusDto,
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
  async findOne(id: number): Promise<IResponse<MenuDetailsDto>> {
    try {
      const menu = await this.prisma.menu.findUnique({
        where: { id },
        include: {
          monday: true, // Trae todos los campos de la relación 'monday'
          tuesday: true, // Trae todos los campos de la relación 'tuesday'
          wednesday: true, // Trae todos los campos de la relación 'wednesday'
          thursday: true, // Trae todos los campos de la relación 'thursday'
          friday: true, // Trae todos los campos de la relación 'friday'
        },
      });

      // Si no se encuentra el plato, devolver un error en formato IErrorResponse
      if (!menu) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/menu/${id}`,
            message: `El menu con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Convertir el resultado en un objeto `menuDto`
      const menuDto: MenuDetailsDto = {
        id: menu.id,
        weekStart: menu.weekStart.toISOString(),
        weekEnd: menu.weekEnd.toISOString(),
        isActive: menu.isActive,
        createdAt: menu.createdAt.toISOString(),
        updatedAt: menu.updatedAt.toISOString(),
        mondayId: menu.mondayId,
        tuesdayId: menu.tuesdayId,
        wednesdayId: menu.wednesdayId,
        thursdayId: menu.thursdayId,
        fridayId: menu.fridayId,
        // Propiedades de las relaciones
        monday: {
          id: menu.monday.id,
          title: menu.monday.title,
          description: menu.monday.description,
          photo: menu.monday.photo,
          votesCount: 0,
          calories: menu.monday.calories,
          cost: menu.monday.cost,
          carbohydrates: menu.monday.carbohydrates,
          proteins: menu.monday.proteins,
          fats: menu.monday.fats,
        },
        tuesday: {
          id: menu.monday.id,
          title: menu.monday.title,
          description: menu.monday.description,
          photo: menu.monday.photo,
          votesCount: 0,
          calories: menu.monday.calories,
          cost: menu.monday.cost,
          carbohydrates: menu.monday.carbohydrates,
          proteins: menu.monday.proteins,
          fats: menu.monday.fats,
        },
        wednesday: {
          id: menu.monday.id,
          title: menu.monday.title,
          description: menu.monday.description,
          photo: menu.monday.photo,
          votesCount: 0,
          calories: menu.monday.calories,
          cost: menu.monday.cost,
          carbohydrates: menu.monday.carbohydrates,
          proteins: menu.monday.proteins,
          fats: menu.monday.fats,
        },
        thursday: {
          id: menu.monday.id,
          title: menu.monday.title,
          description: menu.monday.description,
          photo: menu.monday.photo,
          votesCount: 0,
          calories: menu.monday.calories,
          cost: menu.monday.cost,
          carbohydrates: menu.monday.carbohydrates,
          proteins: menu.monday.proteins,
          fats: menu.monday.fats,
        },
        friday: {
          id: menu.monday.id,
          title: menu.monday.title,
          description: menu.monday.description,
          photo: menu.monday.photo,
          votesCount: 0,
          calories: menu.monday.calories,
          cost: menu.monday.cost,
          carbohydrates: menu.monday.carbohydrates,
          proteins: menu.monday.proteins,
          fats: menu.monday.fats,
        },
      };

      // Retornar el objeto con la estructura de `IResponse`
      return {
        success: true,
        data: menuDto,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }

  async update(
    id: number,
    updatemenuDto: UpdateMenuDto,
  ): Promise<IResponse<MenuDto>> {
    try {
      // Verificar si el plato existe
      const existingmenu = await this.prisma.menu.findUnique({ where: { id } });

      if (!existingmenu) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/menu/${id}`,
            message: `El menu con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Actualizar el plato
      const updatedmenu = await this.prisma.menu.update({
        where: { id },
        data: {
          isActive: updatemenuDto.isActive,
          ...(updatemenuDto.weekStart && {
            weekStart: new Date(updatemenuDto.weekStart),
          }),
          ...(updatemenuDto.weekEnd && {
            weekEnd: new Date(updatemenuDto.weekEnd),
          }),
          mondayId: updatemenuDto.mondayId,
          tuesdayId: updatemenuDto.tuesdayId,
          wednesdayId: updatemenuDto.wednesdayId,
          thursdayId: updatemenuDto.thursdayId,
          fridayId: updatemenuDto.fridayId,
        },
      });

      // Retornar la respuesta con `IResponse`
      return {
        success: true,
        data: {
          id: updatedmenu.id,
          weekStart: updatedmenu.weekStart.toISOString(),
          weekEnd: updatedmenu.weekEnd.toISOString(),
          isActive: updatedmenu.isActive,
          createdAt: updatedmenu.createdAt.toISOString(),
          updatedAt: updatedmenu.updatedAt.toISOString(),
          mondayId: updatedmenu.mondayId,
          tuesdayId: updatedmenu.tuesdayId,
          wednesdayId: updatedmenu.wednesdayId,
          thursdayId: updatedmenu.thursdayId,
          fridayId: updatedmenu.fridayId,
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
      const existingmenu = await this.prisma.menu.findUnique({ where: { id } });

      if (!existingmenu) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/menu/${id}`,
            message: `El menu con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Eliminar el plato
      await this.prisma.menu.delete({ where: { id } });

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

  async findWeekMenu(): Promise<IResponse<MenuDetailsDto>> {
    try {
      const requestedDate = new Date();

      const menu = await this.prisma.menu.findFirst({
        where: {
          weekStart: { lte: requestedDate },
          weekEnd: { gte: requestedDate },
        },
        include: {
          monday: true, // Trae todos los campos de la relación 'monday'
          tuesday: true, // Trae todos los campos de la relación 'tuesday'
          wednesday: true, // Trae todos los campos de la relación 'wednesday'
          thursday: true, // Trae todos los campos de la relación 'thursday'
          friday: true, // Trae todos los campos de la relación 'friday'
        },
      });

      // Si no se encuentra el plato, devolver un error en formato IErrorResponse
      if (!menu) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/menues/${requestedDate.toISOString()}`,
            message: `El menu de esta semana no disponible`,
            timestamp: new Date().toISOString(),
          },
        };
      } else {
        const menuDto: MenuDetailsDto = {
          id: menu.id,
          weekStart: menu.weekStart.toISOString(),
          weekEnd: menu.weekEnd.toISOString(),
          isActive: menu.isActive,
          createdAt: menu.createdAt.toISOString(),
          updatedAt: menu.updatedAt.toISOString(),
          mondayId: menu.mondayId,
          tuesdayId: menu.tuesdayId,
          wednesdayId: menu.wednesdayId,
          thursdayId: menu.thursdayId,
          fridayId: menu.fridayId,
          // Propiedades de las relaciones
          monday: {
            id: menu.monday.id,
            title: menu.monday.title,
            description: menu.monday.description,
            photo: menu.monday.photo,
            votesCount: 0,
            calories: menu.monday.calories,
            cost: menu.monday.cost,
            carbohydrates: menu.monday.carbohydrates,
            proteins: menu.monday.proteins,
            fats: menu.monday.fats,
          },
          tuesday: {
            id: menu.monday.id,
            title: menu.monday.title,
            description: menu.monday.description,
            photo: menu.monday.photo,
            votesCount: 0,
            calories: menu.monday.calories,
            cost: menu.monday.cost,
            carbohydrates: menu.monday.carbohydrates,
            proteins: menu.monday.proteins,
            fats: menu.monday.fats,
          },
          wednesday: {
            id: menu.monday.id,
            title: menu.monday.title,
            description: menu.monday.description,
            photo: menu.monday.photo,
            votesCount: 0,
            calories: menu.monday.calories,
            cost: menu.monday.cost,
            carbohydrates: menu.monday.carbohydrates,
            proteins: menu.monday.proteins,
            fats: menu.monday.fats,
          },
          thursday: {
            id: menu.monday.id,
            title: menu.monday.title,
            description: menu.monday.description,
            photo: menu.monday.photo,
            votesCount: 0,
            calories: menu.monday.calories,
            cost: menu.monday.cost,
            carbohydrates: menu.monday.carbohydrates,
            proteins: menu.monday.proteins,
            fats: menu.monday.fats,
          },
          friday: {
            id: menu.monday.id,
            title: menu.monday.title,
            description: menu.monday.description,
            photo: menu.monday.photo,
            votesCount: 0,
            calories: menu.monday.calories,
            cost: menu.monday.cost,
            carbohydrates: menu.monday.carbohydrates,
            proteins: menu.monday.proteins,
            fats: menu.monday.fats,
          },
        };

        // Retornar el objeto con la estructura de `IResponse`
        return {
          success: true,
          data: menuDto,
          error: null,
        };
      }
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }
}
