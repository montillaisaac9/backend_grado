import RegisterEmployedDto from './dto/registerEmployedDto.dto';
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { PrismaService } from '../prisma/prisma.service';
import { EmpleadoAdmin } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { validateOrReject, ValidationError } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    registro: RegisterEmployedDto,
  ): Promise<IResponse<EmpleadoAdmin>> {
    try {
      // Validar DTO antes de procesarlo
      await validateOrReject(registro).catch((errors: ValidationError[]) => {
        const errorMessages: string[] = errors.flatMap((err) =>
          err.constraints ? Object.values(err.constraints) : [],
        );
        throw new ForbiddenException({
          success: false,
          data: null,
          error: errorMessages,
        });
      });

      if (!registro.contraseña) {
        throw new ForbiddenException({
          success: false,
          data: null,
          error: 'La contraseña no puede estar vacía',
        });
      }

      const hashedPassword = await bcrypt.hash(registro.contraseña, 10);

      const nuevoEmpleado = await this.prisma.empleadoAdmin.create({
        data: {
          correo: registro.correo,
          nombre: registro.nombre,
          cargo: registro.cargo,
          palabra_seguridad: registro.palabra_seguridad,
          cedula: registro.cedula,
          contraseña: hashedPassword,
        },
      });

      return {
        success: true,
        data: nuevoEmpleado,
        error: null,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException({
            success: false,
            data: null,
            error: 'El correo o la cédula ya están registrados',
          });
        }
      }
      if (error instanceof ForbiddenException) {
        throw error;
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException({
        success: false,
        data: null,
        error: 'Error en la creación del usuario',
      });
    }
  }

  findAll() {
    return `This action returns all authentication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authentication`;
  }

  remove(id: number) {
    return `This action removes a #${id} authentication`;
  }
}
