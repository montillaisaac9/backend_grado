import RegisterStudentDtoR from './dto/registerStudentDto.dto';
import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { PrismaService } from '../prisma/prisma.service';
import { AdminEmployee, Student } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import LoginDto from './dto/login.dto';
import RegisterEmployeeDto from './dto/registerEmployedDto.dto';
import {
  PrismaErrorCode,
  PrismaErrorMessages,
} from 'src/common/enums/codeErrorPrisma';

@Injectable()
export class AuthenticationService {
  constructor(private readonly prisma: PrismaService) {}

  async createEmployee(
    registration: RegisterEmployeeDto,
  ): Promise<IResponse<AdminEmployee>> {
    try {
      // Validar que la contraseña no esté vacía
      if (!registration.password || registration.password.trim().length === 0) {
        throw new BadRequestException('Password cannot be empty');
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(registration.password, 10);

      // Crear el empleado en la base de datos
      const newEmployee = await this.prisma.adminEmployee.create({
        data: {
          email: registration.email,
          identification: registration.identification,
          password: hashedPassword,
          securityWord: registration.securityWord,
          name: registration.name,
          position: registration.position,
        },
      });

      return {
        success: true,
        data: newEmployee,
        error: null,
      };
    } catch (error: unknown) {
      return this.handleErrors(error);
    }
  }

  async createStudent(
    registro: RegisterStudentDtoR,
  ): Promise<IResponse<Student>> {
    try {
      // Validación de la contraseña (ya que ValidationPipe no valida si es opcional)
      if (!registro.password || registro.password.trim().length === 0) {
        throw new BadRequestException('La contraseña no puede estar vacía');
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(registro.password, 10);

      // Crear el usuario en la base de datos
      const nuevoEstudiante = await this.prisma.student.create({
        data: {
          email: registro.email,
          identification: registro.identification,
          name: registro.name,
          career: registro.career,
          password: hashedPassword,
          securityWord: registro.securityWord,
          photo: registro.photo,
        },
      });

      return {
        success: true,
        data: nuevoEstudiante,
        error: null,
      };
    } catch (error) {
      return this.handleErrors(error);
    }
  }
  async login(loginDto: LoginDto): Promise<IResponse<Student | AdminEmployee>> {
    try {
      const usuario = await this.buscarUsuarioPorRol(loginDto);

      if (!usuario) {
        throw new BadRequestException('Correo no registrado');
      }

      const contraseñaValida = await bcrypt.compare(
        loginDto.password,
        usuario.password,
      );

      if (!contraseñaValida) {
        throw new BadRequestException('Contraseña incorrecta');
      }

      return {
        success: true,
        data: usuario,
        error: null,
      };
    } catch (error) {
      return this.handleErrors(error);
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

  private async buscarUsuarioPorRol(loginDto: LoginDto) {
    switch (loginDto.role) {
      case 'admin':
        return this.prisma.adminEmployee.findFirst({
          where: { email: loginDto.email },
        });
      case 'estudiante':
        return this.prisma.student.findFirst({
          where: { email: loginDto.email },
        });
      default:
        throw new BadRequestException('Rol no válido');
    }
  }

  private handleErrors(error: any): never | IResponse<any> {
    if (error instanceof BadRequestException) {
      throw error;
    }
    if (error instanceof PrismaClientKnownRequestError) {
      const errorMessage =
        PrismaErrorMessages[error.code as PrismaErrorCode] || 'Database error';

      const errorCode = error.code as PrismaErrorCode;
      switch (errorCode) {
        case PrismaErrorCode.UniqueConstraintViolation:
        case PrismaErrorCode.RecordNotFound:
        case PrismaErrorCode.ForeignKeyConstraintViolation:
        case PrismaErrorCode.InvalidFieldValue:
        case PrismaErrorCode.RelationDoesNotExist:
          throw new BadRequestException(errorMessage);

        case PrismaErrorCode.QueryTimeout:
          throw new InternalServerErrorException(errorMessage);

        default:
          throw new InternalServerErrorException(
            PrismaErrorMessages[PrismaErrorCode.UnhandledError] ||
              'Unhandled database error',
          );
      }
    }
    throw new InternalServerErrorException('Error inesperado en el servidor');
  }
}
