import { Injectable } from '@nestjs/common';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';
import { StatsResponseDto, DailyStatsDto } from './dto/stats-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleErrors } from 'src/common/utils/error-handler';
import { IResponse } from 'src/common/interfaces/response.interface';
import { IPaginatedResponse } from 'src/common/interfaces/responsePaginate.interface';
import { PaginationDto } from 'src/common/dto/paginationParams.dto';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStatDto: CreateStatDto): Promise<IResponse<StatsResponseDto>> {
    try {
      // Usar la fecha proporcionada o la fecha actual
      const targetDate = createStatDto.date ? new Date(createStatDto.date) : new Date();
      
      // Establecer la fecha al inicio del día
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      console.log(`Buscando estadísticas para la fecha: ${startOfDay.toISOString()} a ${endOfDay.toISOString()}`);

      // Verificar si ya existe una estadística para esta fecha
      const existingStat = await this.prisma.stats.findUnique({
        where: { date: startOfDay },
        include: { dish: true }
      });

      if (existingStat) {
        console.log('Estadística ya existe para esta fecha');
        const statsResponse: StatsResponseDto = {
          id: existingStat.id,
          date: existingStat.date.toISOString(),
          totalDish: existingStat.totalDish,
          dishId: existingStat.dishId,
          totalAttendance: existingStat.totalAttendance,
          createdAt: existingStat.createdAt.toISOString(),
          dish: {
            id: existingStat.dish.id,
            title: existingStat.dish.title,
            description: existingStat.dish.description,
            calories: existingStat.dish.calories,
            cost: existingStat.dish.cost,
          }
        };

        return {
          success: true,
          data: statsResponse,
          error: null,
        };
      }

      console.log('Generando nuevas estadísticas...');
      // Generar estadísticas automáticamente
      const dailyStats = await this.generateDailyStats(startOfDay, endOfDay);

      if (!dailyStats) {
        console.log('No se encontraron menús para generar estadísticas');
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: '/stats',
            message: 'No se encontraron menús para generar estadísticas en la fecha especificada',
            timestamp: new Date().toISOString(),
          },
        };
      }

      console.log('Estadísticas generadas:', dailyStats);

      // Crear nueva estadística en la base de datos
      const newStat = await this.prisma.stats.create({
        data: {
          date: startOfDay,
          totalDish: dailyStats.totalDishes,
          dishId: dailyStats.mostPopularDish.id,
          totalAttendance: dailyStats.totalAttendances,
        },
        include: { dish: true }
      });

      console.log('Estadística creada en la base de datos:', newStat);

      // Mapear el resultado
      const statsResponse: StatsResponseDto = {
        id: newStat.id,
        date: newStat.date.toISOString(),
        totalDish: newStat.totalDish,
        dishId: newStat.dishId,
        totalAttendance: newStat.totalAttendance,
        createdAt: newStat.createdAt.toISOString(),
        dish: {
          id: newStat.dish.id,
          title: newStat.dish.title,
          description: newStat.dish.description,
          calories: newStat.dish.calories,
          cost: newStat.dish.cost,
        }
      };

      return {
        success: true,
        data: statsResponse,
        error: null,
      };

    } catch (error: unknown) {
      console.error('Error en stats.service.create:', error);
      return handleErrors<StatsResponseDto>(error);
    }
  }

  async findAll(pagination: PaginationDto): Promise<IResponse<IPaginatedResponse<Array<StatsResponseDto>>>> {
    try {
      const { offset = 0, limit = 10 } = pagination;

      // Obtener el total de registros
      const total = await this.prisma.stats.count();

      // Obtener las estadísticas con paginación
      const stats = await this.prisma.stats.findMany({
        include: { dish: true },
        skip: offset,
        take: limit,
        orderBy: { date: 'desc' }
      });

      // Mapear los resultados
      const statsResponse: StatsResponseDto[] = stats.map(stat => ({
        id: stat.id,
        date: stat.date.toISOString(),
        totalDish: stat.totalDish,
        dishId: stat.dishId,
        totalAttendance: stat.totalAttendance,
        createdAt: stat.createdAt.toISOString(),
        dish: {
          id: stat.dish.id,
          title: stat.dish.title,
          description: stat.dish.description,
          calories: stat.dish.calories,
          cost: stat.dish.cost,
        }
      }));

      const response: IPaginatedResponse<Array<StatsResponseDto>> = {
        offset,
        limit,
        arrayList: statsResponse,
        total,
      };

      return {
        success: true,
        data: response,
        error: null,
      };

    } catch (error: unknown) {
      return handleErrors<IPaginatedResponse<Array<StatsResponseDto>>>(error);
    }
  }

  async findOne(id: number): Promise<IResponse<StatsResponseDto | null>> {
    try {
      const stat = await this.prisma.stats.findUnique({
        where: { id },
        include: { dish: true }
      });

      if (!stat) {
        return {
          success: true,
          data: null,
          error: null,
        };
      }

      const statsResponse: StatsResponseDto = {
        id: stat.id,
        date: stat.date.toISOString(),
        totalDish: stat.totalDish,
        dishId: stat.dishId,
        totalAttendance: stat.totalAttendance,
        createdAt: stat.createdAt.toISOString(),
        dish: {
          id: stat.dish.id,
          title: stat.dish.title,
          description: stat.dish.description,
          calories: stat.dish.calories,
          cost: stat.dish.cost,
        }
      };

      return {
        success: true,
        data: statsResponse,
        error: null,
      };

    } catch (error: unknown) {
      return handleErrors<StatsResponseDto | null>(error);
    }
  }

  async getDailyStats(date: string): Promise<IResponse<DailyStatsDto | null>> {
    try {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const dailyStats = await this.generateDailyStats(startOfDay, endOfDay);

      return {
        success: true,
        data: dailyStats,
        error: null,
      };

    } catch (error: unknown) {
      return handleErrors<DailyStatsDto | null>(error);
    }
  }

  private async generateDailyStats(startOfDay: Date, endOfDay: Date): Promise<DailyStatsDto | null> {
    try {
      console.log(`Searching for menu items between ${startOfDay} and ${endOfDay}`);
      
      const statsData = await this.prisma.menuItem.findMany({
        where: {
          date: { gte: startOfDay, lte: endOfDay }
        },
        include: {
          dish: true,
          _count: {
            select: { attendances: true }
          }
        }
      });

      console.log(`Found ${statsData.length} menu items for this date`);
      
      if (statsData.length === 0) {
        console.log('No menu items found for the specified date');
        return null;
      }

      const uniqueDishes = new Set(statsData.map(item => item.dishId));
      const totalDishes = uniqueDishes.size;
      const totalAttendances = statsData.reduce((sum, item) => sum + item._count.attendances, 0);

      console.log(`Calculated ${totalDishes} unique dishes and ${totalAttendances} total attendances`);

      const dishStats = statsData.map(item => ({
        dish: item.dish,
        attendances: item._count.attendances
      }));

      const mostPopular = dishStats.reduce((max, current) => 
        current.attendances > max.attendances ? current : max,
        { attendances: 0, dish: dishStats[0].dish }
      );

      console.log(`Most popular dish: ${mostPopular.dish.title} with ${mostPopular.attendances} attendances`);

      return {
        date: startOfDay.toISOString().split('T')[0],
        totalDishes,
        totalAttendances,
        mostPopularDish: {
          id: mostPopular.dish.id,
          title: mostPopular.dish.title,
          description: mostPopular.dish.description,
          calories: mostPopular.dish.calories,
          cost: mostPopular.dish.cost
        },
        mostPopularDishAttendances: mostPopular.attendances
      };
    } catch (error) {
      console.error('Error generating daily stats:', error);
      throw error;
    }
  }

  // Método para eliminar estadísticas (solo para administradores)
  async remove(id: number): Promise<IResponse<string>> {
    try {
      await this.prisma.stats.delete({
        where: { id },
      });

      return {
        success: true,
        data: `Estadística con ID ${id} eliminada correctamente`,
        error: null,
      };

    } catch (error: unknown) {
      return handleErrors<string>(error);
    }
  }
}
