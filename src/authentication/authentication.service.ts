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
import LoginDto from './dto/login.dto';
import RegisterEmployeeDto from './dto/registerEmployedDto.dto';
import {
  PrismaErrorCode,
  PrismaErrorMessages,
} from 'src/common/enums/codeErrorPrisma';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

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

      // Crear el empleado
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

      // Crear las relaciones en la tabla intermedia
      const careerConnections = registration.careerIds.map((careerId) => ({
        adminEmployeeId: newEmployee.id,
        careerId: careerId,
      }));

      // Insertar las relaciones en la tabla intermedia AdminEmployeeCareer
      await this.prisma.adminEmployeeCareer.createMany({
        data: careerConnections,
      });

      // Obtener el empleado actualizado con las relaciones de carrera conectadas
      const employ = await this.prisma.adminEmployee.findUnique({
        where: { id: newEmployee.id },
        include: {
          careers: true, // Incluye las carreras asociadas para la verificación
        },
      });

      return {
        success: true,
        data: employ,
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
      const newStudent = await this.prisma.student.create({
        data: {
          email: registro.email,
          identification: registro.identification,
          name: registro.name,
          password: hashedPassword,
          securityWord: registro.securityWord,
          photo: registro.photo,
        },
      });

      // Crear las relaciones en la tabla intermedia para conectar al estudiante con las carreras
      const careerConnections = registro.careerIds.map((careerId) => ({
        studentId: newStudent.id,
        careerId: careerId,
      }));

      // Insertar las relaciones en la tabla intermedia StudentCareer
      await this.prisma.studentCareer.createMany({
        data: careerConnections,
      });

      // Obtener el estudiante actualizado con las relaciones de carrera conectadas
      const student = await this.prisma.student.findUnique({
        where: { id: newStudent.id },
        include: {
          careers: true, // Incluye las carreras asociadas al estudiante
        },
      });

      return {
        success: true,
        data: student,
        error: null,
      };
    } catch (error) {
      return this.handleErrors(error);
    }
  }

  async login(
    loginDto: LoginDto,
    res: Response,
  ): Promise<IResponse<Student | AdminEmployee>> {
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

      // Generar el token JWT
      const jwtSecret = process.env.JWT_SECRET || 'default_secret_value';
      const token = jwt.sign(
        { id: usuario.id, role: loginDto.role },
        jwtSecret,
        { expiresIn: '12h' },
      );

      // Setear la cookie en la respuesta
      res.cookie('auth_token', token, {
        httpOnly: true, // No accesible desde JavaScript
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        sameSite: 'strict', // Protege contra CSRF
        maxAge: 3600000, // 1 hora de duración
      });

      return {
        success: true,
        data: usuario,
        error: null,
      };
    } catch (error: any) {
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
          include: {
            careers: {
              select: {
                career: {
                  select: {
                    name: true, // Solo traemos el nombre de la carrera
                  },
                },
              },
            },
          },
        });
      case 'estudiante':
        return this.prisma.student.findFirst({
          where: { email: loginDto.email },
          include: {
            careers: {
              select: {
                career: {
                  select: {
                    name: true, // Solo traemos el nombre de la carrera
                  },
                },
              },
            },
          },
        });

      default:
        throw new BadRequestException('Rol no válido');
    }
  }

  private handleErrors(error: any): never | IResponse<any> {
    console.log(error);
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
