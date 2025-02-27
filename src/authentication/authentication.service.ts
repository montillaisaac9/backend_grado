import RegisterEmployedDto from './dto/registerEmployedDto.dto';
import RegisterStudentDtoR from './dto/registerStudentDto.dto';
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { PrismaService } from '../prisma/prisma.service';
import { EmpleadoAdmin, Estudiante } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(private readonly prisma: PrismaService) {}

  async createEmployed(
    registro: RegisterEmployedDto,
  ): Promise<IResponse<EmpleadoAdmin>> {
    try {
      // Validación de la contraseña (ya que ValidationPipe no valida si es opcional)
      if (!registro.contraseña || registro.contraseña.trim().length === 0) {
        throw new BadRequestException('La contraseña no puede estar vacía');
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(registro.contraseña, 10);

      // Crear el usuario en la base de datos
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
          throw new ConflictException(
            'El correo o la cédula ya están registrados',
          );
        }
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error en la creación del usuario',
      );
    }
  }

  async createStudent(
    registro: RegisterStudentDtoR,
  ): Promise<IResponse<Estudiante>> {
    try {
      // Validación de la contraseña (ya que ValidationPipe no valida si es opcional)
      if (!registro.contraseña || registro.contraseña.trim().length === 0) {
        throw new BadRequestException('La contraseña no puede estar vacía');
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(registro.contraseña, 10);

      // Crear el usuario en la base de datos
      const nuevoEstudiante = await this.prisma.estudiante.create({
        data: {
          correo: registro.correo,
          nombre: registro.nombre,
          carrera: registro.carrera,
          foto: registro.foto,
          palabra_seguridad: registro.palabra_seguridad,
          cedula: registro.cedula,
          contraseña: hashedPassword,
        },
      });

      return {
        success: true,
        data: nuevoEstudiante,
        error: null,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'El correo o la cédula ya están registrados',
          );
        }
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error en la creación del usuario',
      );
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
