import { Injectable } from '@nestjs/common';
import { CreateCareerDto } from './dto/create-carier.dto';
import { UpdateCarierDto } from './dto/update-carier.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IResponse } from 'src/common/interfaces/response.interface';
import { handleErrors } from 'src/common/utils/error-handler';
import { CareerDto } from './dto/carer.dto';

@Injectable()
export class CariersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCarierDto: CreateCareerDto): Promise<IResponse<string>> {
    try {
      const comment = await this.prisma.career.create({
        data: {
          ...createCarierDto,
        },
      });
      return {
        success: true,
        data: `carrera creada correctamente carrera.id: ${comment.id}`,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors<string>(error);
    }
  }
  async findAll(): Promise<IResponse<Array<CareerDto>>> {
    try {
      const careers = await this.prisma.career.findMany();

      const careersArray: Array<CareerDto> = careers.map((career) => ({
        id: career.id,
        name: career.name,
        description: career.description ?? undefined, // Convierte null en undefined
        createdAt: career.createdAt,
        updatedAt: career.updatedAt,
        isActive: career.isActive,
      }));

      return {
        success: true,
        data: careersArray,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors<CareerDto[]>(error);
    }
  }

  async findOne(id: number): Promise<IResponse<CareerDto>> {
    try {
      const career = await this.prisma.career.findUnique({
        where: { id },
      });

      if (!career) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/careers/${id}`,
            message: `La carrera con ID ${id} no fue encontrada.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      const careerDto: CareerDto = {
        id: career.id,
        name: career.name,
        description: career.description ?? undefined,
        createdAt: career.createdAt,
        updatedAt: career.updatedAt,
        isActive: career.isActive,
      };

      return {
        success: true,
        data: careerDto,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }

  async update(
    id: number,
    updateCareerDto: UpdateCarierDto,
  ): Promise<IResponse<CareerDto>> {
    try {
      const existingCareer = await this.prisma.career.findUnique({
        where: { id },
      });

      if (!existingCareer) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/careers/${id}`,
            message: `La carrera con ID ${id} no fue encontrada.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      const updatedCareer = await this.prisma.career.update({
        where: { id },
        data: {
          ...updateCareerDto,
        },
      });

      const careerDto: CareerDto = {
        id: updatedCareer.id,
        name: updatedCareer.name,
        description: updatedCareer.description ?? undefined,
        createdAt: updatedCareer.createdAt,
        updatedAt: updatedCareer.updatedAt,
        isActive: updatedCareer.isActive,
      };

      return {
        success: true,
        data: careerDto,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }

  async remove(id: number): Promise<IResponse<null>> {
    try {
      const existingCareer = await this.prisma.career.findUnique({
        where: { id },
      });

      if (!existingCareer) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/careers/${id}`,
            message: `La carrera con ID ${id} no fue encontrada.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      await this.prisma.career.delete({ where: { id } });

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
