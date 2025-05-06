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
import { MenuDetailsDto, DishInfoDto } from './dto/detailsMenu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto): Promise<IResponse<string>> {
    try {
      // Crear una transacción para mantener consistencia
      const newMenu = await this.prisma.$transaction(async (prisma) => {
        // 1. Crear el menú
        const menu = await prisma.menu.create({
          data: {
            weekStart: new Date(createMenuDto.weekStart),
            weekEnd: new Date(createMenuDto.weekEnd),
            isActive: createMenuDto.isActive,
          },
        });

        // 2. Crear los elementos del menú (MenuItem) para cada día
        for (const item of createMenuDto.menuItems) {
          await prisma.menuItem.create({
            data: {
              date: new Date(item.date),
              weekDay: item.weekDay,
              menuId: menu.id,
              dishId: item.dishId,
            },
          });
        }

        return menu;
      });

      return {
        success: true,
        data: `Menu creado correctamente con ID: ${newMenu.id}`,
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

      // Obtener los menús con paginación, incluyendo los elementos del menú
      const menus = await this.prisma.menu.findMany({
        skip: offset,
        take: limit,
        include: {
          menuItems: true,
        },
      });

      // Crear un arreglo de MenuDto para devolver la respuesta
      const menusDto: Array<MenuDto> = menus.map((menu) => ({
        id: menu.id,
        weekStart: menu.weekStart.toISOString(),
        weekEnd: menu.weekEnd.toISOString(),
        isActive: menu.isActive,
        createdAt: menu.createdAt.toISOString(),
        updatedAt: menu.updatedAt.toISOString(),
        menuItems: menu.menuItems.map((item) => ({
          id: item.id,
          date: item.date.toISOString(),
          weekDay: item.weekDay,
          dishId: item.dishId,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
        })),
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
          menuItems: {
            include: {
              dish: true,
            },
          },
        },
      });

      // Si no se encuentra el menú, devolver un error
      if (!menu) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/menu/${id}`,
            message: `El menú con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Crear objeto para almacenar los platos por día
      const dayDishes: Record<string, DishInfoDto> = {};

      // Preparar los elementos del menú con información detallada de los platos
      const menuItemDetails = menu.menuItems.map((item) => {
        const dishInfo: DishInfoDto = {
          id: item.dish.id,
          title: item.dish.title,
          description: item.dish.description,
          photo: item.dish.photo,
          votesCount: 0, // Esto se podría calcular desde DishRating si es necesario
          calories: item.dish.calories,
          cost: item.dish.cost,
          carbohydrates: item.dish.carbohydrates,
          proteins: item.dish.proteins,
          fats: item.dish.fats,
        };

        // Almacenar el plato por día para fácil acceso
        dayDishes[item.weekDay.toLowerCase()] = dishInfo;

        return {
          id: item.id,
          date: item.date.toISOString(),
          weekDay: item.weekDay,
          dish: dishInfo,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
        };
      });

      // Crear el DTO de detalles del menú
      const menuDetailsDto: MenuDetailsDto = {
        id: menu.id,
        weekStart: menu.weekStart.toISOString(),
        weekEnd: menu.weekEnd.toISOString(),
        isActive: menu.isActive,
        createdAt: menu.createdAt.toISOString(),
        updatedAt: menu.updatedAt.toISOString(),
        menuItems: menuItemDetails,
        // Asignar los platos por día para mantener compatibilidad con código existente
        monday: dayDishes.monday,
        tuesday: dayDishes.tuesday,
        wednesday: dayDishes.wednesday,
        thursday: dayDishes.thursday,
        friday: dayDishes.friday,
      };

      return {
        success: true,
        data: menuDetailsDto,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }

  async update(
    id: number,
    updateMenuDto: UpdateMenuDto,
  ): Promise<IResponse<MenuDto>> {
    try {
      // Verificar si el menú existe
      const existingMenu = await this.prisma.menu.findUnique({
        where: { id },
        include: { menuItems: true },
      });

      if (!existingMenu) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/menu/${id}`,
            message: `El menú con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Actualizar el menú y sus elementos en una transacción
      const updatedMenu = await this.prisma.$transaction(async (prisma) => {
        // 1. Actualizar el menú principal
        const menu = await prisma.menu.update({
          where: { id },
          data: {
            isActive: updateMenuDto.isActive,
            ...(updateMenuDto.weekStart && {
              weekStart: new Date(updateMenuDto.weekStart),
            }),
            ...(updateMenuDto.weekEnd && {
              weekEnd: new Date(updateMenuDto.weekEnd),
            }),
          },
          include: { menuItems: true },
        });
        console.log(menu);

        // 2. Si hay elementos del menú para actualizar
        if (updateMenuDto.menuItems && updateMenuDto.menuItems.length > 0) {
          // Eliminar los elementos existentes
          await prisma.menuItem.deleteMany({
            where: { menuId: id },
          });

          // Crear los nuevos elementos
          for (const item of updateMenuDto.menuItems) {
            await prisma.menuItem.create({
              data: {
                date: new Date(item.date),
                weekDay: item.weekDay,
                menuId: id,
                dishId: item.dishId,
              },
            });
          }
        }

        // Obtener el menú actualizado con todos sus elementos
        return prisma.menu.findUnique({
          where: { id },
          include: { menuItems: true },
        });
      });

      if (updatedMenu != null) {
        const menuDto: MenuDto = {
          id: updatedMenu.id,
          weekStart: updatedMenu.weekStart.toISOString(),
          weekEnd: updatedMenu.weekEnd.toISOString(),
          isActive: updatedMenu.isActive,
          createdAt: updatedMenu.createdAt.toISOString(),
          updatedAt: updatedMenu.updatedAt.toISOString(),
          menuItems: updatedMenu.menuItems.map((item) => ({
            id: item.id,
            date: item.date.toISOString(),
            weekDay: item.weekDay,
            dishId: item.dishId,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
          })),
        };
        return {
          success: true,
          data: menuDto,
          error: null,
        };
      } else {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/menu/${id}`,
            message: `El menú con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }

  async remove(id: number): Promise<IResponse<null>> {
    try {
      // Verificar si el menú existe
      const existingMenu = await this.prisma.menu.findUnique({ where: { id } });

      if (!existingMenu) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/menu/${id}`,
            message: `El menú con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Eliminar en una transacción para mantener integridad
      await this.prisma.$transaction(async (prisma) => {
        // 1. Eliminar todos los elementos del menú
        await prisma.menuItem.deleteMany({ where: { menuId: id } });

        // 2. Eliminar el menú
        await prisma.menu.delete({ where: { id } });
      });

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

      // Buscar el menú para la semana actual
      const menu = await this.prisma.menu.findFirst({
        where: {
          weekStart: { lte: requestedDate },
          weekEnd: { gte: requestedDate },
        },
        include: {
          menuItems: {
            include: {
              dish: true,
            },
          },
        },
      });

      // Si no se encuentra el menú, devolver un error
      if (!menu) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/menus/week/${requestedDate.toISOString()}`,
            message: `El menú de esta semana no está disponible`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Crear objeto para almacenar los platos por día
      const dayDishes: Record<string, DishInfoDto> = {};

      // Preparar los elementos del menú con información detallada de los platos
      const menuItemDetails = menu.menuItems.map((item) => {
        const dishInfo: DishInfoDto = {
          id: item.dish.id,
          title: item.dish.title,
          description: item.dish.description,
          photo: item.dish.photo,
          votesCount: 0, // Esto se podría calcular desde DishRating si es necesario
          calories: item.dish.calories,
          cost: item.dish.cost,
          carbohydrates: item.dish.carbohydrates,
          proteins: item.dish.proteins,
          fats: item.dish.fats,
        };

        // Almacenar el plato por día para fácil acceso (convertir a minúsculas para la clave)
        const dayKey = item.weekDay.toLowerCase();
        dayDishes[dayKey] = dishInfo;

        return {
          id: item.id,
          date: item.date.toISOString(),
          weekDay: item.weekDay,
          dish: dishInfo,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
        };
      });

      // Crear el DTO de detalles del menú
      const menuDetailsDto: MenuDetailsDto = {
        id: menu.id,
        weekStart: menu.weekStart.toISOString(),
        weekEnd: menu.weekEnd.toISOString(),
        isActive: menu.isActive,
        createdAt: menu.createdAt.toISOString(),
        updatedAt: menu.updatedAt.toISOString(),
        menuItems: menuItemDetails,
        // Asignar los platos por día para mantener compatibilidad con código existente
        monday: dayDishes.monday,
        tuesday: dayDishes.tuesday,
        wednesday: dayDishes.wednesday,
        thursday: dayDishes.thursday,
        friday: dayDishes.friday,
      };

      return {
        success: true,
        data: menuDetailsDto,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }
}
