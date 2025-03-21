import RegisterStudentDtoR from './dto/CreateStudentDto.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { PrismaService } from '../prisma/prisma.service';
import LoginDto from './dto/login.dto';
import RegisterEmployeeDto from './dto/CreateEmployedDto.dto';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { EmployeeDto } from './dto/empleado.dto';
import { StudentDto } from './dto/student.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { handleErrors } from 'src/common/utils/error-handler';
import { UpdateStudentDto } from './dto/UpdateStudentDto';
import { UpdateEmplyedDto } from './dto/UpdateEmployedDto';

@Injectable()
export class AuthenticationService {
  constructor(private readonly prisma: PrismaService) {}

  async createEmployee(
    registration: RegisterEmployeeDto,
  ): Promise<IResponse<EmployeeDto>> {
    try {
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
          careers: {
            include: {
              career: {
                // Asegurar que traemos los detalles de la carrera
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!employ) {
        throw new Error('Employee not found after creation');
      }

      // Aplicar DTO
      const employeeDto: EmployeeDto = {
        id: employ.id,
        email: employ.email,
        identification: employ.identification,
        name: employ.name,
        position: employ.position,
        careers: employ.careers.map((careerConnection) => ({
          id: careerConnection.career.id,
          name: careerConnection.career.name,
        })),
      };

      return {
        success: true,
        data: employeeDto,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors<EmployeeDto>(error);
    }
  }

  async createStudent(
    registro: RegisterStudentDtoR,
    url: string,
  ): Promise<IResponse<StudentDto>> {
    try {
      // Validación de la contraseña (ya que ValidationPipe no valida si es opcional)
      if (!registro.password || registro.password.trim().length === 0) {
        throw new BadRequestException('La contraseña no puede estar vacía');
      }
      console.log(url);
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(registro.password, 10);

      // Crear el usuario en la base de datos
      const newStudent = await this.prisma.student.create({
        data: {
          email: registro.email,
          identification: registro.identification,
          name: registro.name,
          password: hashedPassword,
          securityWord: registro.securityWord,
          photo: `http://localhost:3000/${url}`,
        },
      });

      // Crear las relaciones en la tabla intermedia para conectar al estudiante con las carreras
      const careerConnections = registro.careerIds.map((careerId) => ({
        studentId: newStudent.id,
        careerId: Number(careerId),
      }));

      // Insertar las relaciones en la tabla intermedia StudentCareer
      await this.prisma.studentCareer.createMany({
        data: careerConnections,
      });

      // Obtener el estudiante actualizado con las relaciones de carrera conectadas
      const student = await this.prisma.student.findUnique({
        where: { id: newStudent.id },
        include: {
          careers: {
            include: {
              career: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!student) {
        throw new Error('Student not found after creation');
      }

      // Aplicar DTO
      const studentDto: StudentDto = {
        id: student.id,
        email: student.email,
        identification: student.identification,
        name: student.name,
        photo: student.photo,
        careers: student.careers.map((careerConnection) => ({
          id: careerConnection.career.id,
          name: careerConnection.career.name,
        })),
      };

      return {
        success: true,
        data: studentDto,
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors(error);
    }
  }

  async login(
    loginDto: LoginDto,
    res: Response,
  ): Promise<IResponse<StudentDto | EmployeeDto>> {
    try {
      const usuario = await this.buscarUsuarioPorRol(
        loginDto.email,
        loginDto.role,
      );

      if (!usuario) {
        throw new BadRequestException('Correo no registrado');
      }

      // Validar la contraseña
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
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
      });

      // Mapeo del DTO basado en el rol
      let usuarioDto: StudentDto | EmployeeDto;

      if (loginDto.role === 'estudiante' && usuario.careers) {
        usuarioDto = {
          id: usuario.id,
          email: usuario.email,
          identification: usuario.identification,
          name: usuario.name,
          photo: 'photo' in usuario ? (usuario.photo ?? '') : '',
          careers: usuario.careers.map((careerConnection) => ({
            id: careerConnection.career.id,
            name: careerConnection.career.name,
          })),
        };
      } else if (loginDto.role === 'empleado' && usuario.careers) {
        usuarioDto = {
          id: usuario.id,
          email: usuario.email,
          name: usuario.name,
          position: 'position' in usuario ? usuario.position : '',
          identification: usuario.identification,
          careers: usuario.careers.map((careerConnection) => ({
            id: careerConnection.career.id,
            name: careerConnection.career.name,
          })),
        };
      } else {
        throw new BadRequestException('Rol no válido o usuario no encontrado');
      }

      return {
        success: true,
        data: usuarioDto,
        error: null,
      };
    } catch (error) {
      return handleErrors(error);
    }
  }

  private async buscarUsuarioPorRol(email: string, role: string) {
    switch (role) {
      case 'empleado':
        return this.prisma.adminEmployee.findFirst({
          where: { email: email },
          select: {
            id: true,
            email: true,
            name: true,
            position: true,
            password: true,
            securityWord: true,
            identification: true,
            careers: {
              select: {
                career: {
                  select: {
                    id: true,
                    name: true, // Solo tomamos el ID y el nombre de la carrera
                  },
                },
              },
            },
          },
        });
      case 'estudiante':
        return this.prisma.student.findFirst({
          where: { email: email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            identification: true,
            securityWord: true,
            photo: true,
            careers: {
              select: {
                career: {
                  select: {
                    id: true,
                    name: true, // Solo tomamos el ID y el nombre de la carrera
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

  logout(response: Response): IResponse<null> {
    response.clearCookie('auth_token');
    return {
      success: true,
      data: null,
      error: null,
    };
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<IResponse<null>> {
    try {
      const usuario = await this.buscarUsuarioPorRol(
        changePasswordDto.email,
        changePasswordDto.role,
      );
      if (usuario?.securityWord !== changePasswordDto.securityWord) {
        console.log(usuario);
        throw new BadRequestException('Palabra de seguridad incorrecta');
      }
      const hashedPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        10,
      );
      if (changePasswordDto.role === 'empleado') {
        await this.prisma.adminEmployee.update({
          where: { id: usuario.id },
          data: {
            password: hashedPassword,
          },
        });
      } else if (changePasswordDto.role === 'estudiante') {
        await this.prisma.student.update({
          where: { id: usuario.id },
          data: {
            password: hashedPassword,
          },
        });
      } else {
        throw new BadRequestException('Rol no válido');
      }
      return {
        success: true,
        data: null,
        error: null,
      };
    } catch (error) {
      return handleErrors(error);
    }
  }

  async getPerfilStudent(id: number): Promise<IResponse<StudentDto>> {
    try {
      const usuario = await this.prisma.student.findFirst({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          identification: true,
          photo: true,
          careers: {
            select: {
              career: {
                select: { id: true, name: true },
              },
            },
          },
        },
      });

      if (!usuario) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/authentication/student/${id}`,
            message: `El estudiante con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      const usuarioDto = {
        id: usuario.id,
        email: usuario.email,
        identification: usuario.identification,
        name: usuario.name,
        photo: 'photo' in usuario ? (usuario.photo ?? '') : '',
        careers: usuario.careers.map((careerConnection) => ({
          id: careerConnection.career.id,
          name: careerConnection.career.name,
        })),
      };

      return {
        success: true,
        data: usuarioDto,
        error: null,
      };
    } catch (error) {
      return handleErrors(error);
    }
  }

  async getPerfilEmployed(id: number): Promise<IResponse<EmployeeDto>> {
    try {
      const usuario = await this.prisma.adminEmployee.findFirst({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          position: true,
          identification: true,
          careers: {
            select: {
              career: {
                select: { id: true, name: true },
              },
            },
          },
        },
      });

      if (!usuario) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/authentication/employed/${id}`,
            message: `El estudiante con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }
      const usuarioDto = {
        id: usuario.id,
        email: usuario.email,
        name: usuario.name,
        position: 'position' in usuario ? usuario.position : '',
        identification: usuario.identification,
        careers: usuario.careers.map((careerConnection) => ({
          id: careerConnection.career.id,
          name: careerConnection.career.name,
        })),
      };

      return {
        success: true,
        data: usuarioDto,
        error: null,
      };
    } catch (error) {
      return handleErrors(error);
    }
  }

  async editProfileStudent(
    id: number,
    updateStudentDto: UpdateStudentDto,
    url: string | undefined = undefined,
  ): Promise<IResponse<StudentDto>> {
    try {
      const usuario = await this.prisma.student.findFirst({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          identification: true,
          photo: true,
          careers: {
            select: {
              career: {
                select: { id: true, name: true },
              },
            },
          },
        },
      });

      if (!usuario) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/authentication/student/${id}`,
            message: `El estudiante con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Verifica si la contraseña no es nula antes de encriptarla
      const hashedPassword = updateStudentDto.password
        ? await bcrypt.hash(updateStudentDto.password, 10)
        : undefined;

      // Filtra los datos para evitar subir `null` o `undefined`
      const filteredUpdateData = Object.fromEntries(
        Object.entries({
          email: updateStudentDto.email,
          identification: updateStudentDto.identification,
          name: updateStudentDto.name,
          password: hashedPassword,
          securityWord: updateStudentDto.securityWord,
          photo: url ? `http://localhost:3000/${url}` : undefined,
        }).filter(([, v]) => v !== undefined && v !== null),
      );

      // Actualizar la información del estudiante
      await this.prisma.student.update({
        where: { id },
        data: filteredUpdateData,
      });

      // Verificar si se enviaron nuevas carreras para actualizar
      if (updateStudentDto.careerIds) {
        // Eliminar todas las relaciones previas del estudiante en la tabla intermedia
        await this.prisma.studentCareer.deleteMany({
          where: { studentId: id },
        });

        // Insertar las nuevas relaciones en la tabla intermedia StudentCareer
        const careerConnections = updateStudentDto.careerIds.map(
          (careerId) => ({
            studentId: id,
            careerId: Number(careerId),
          }),
        );

        await this.prisma.studentCareer.createMany({
          data: careerConnections,
        });
      }

      // Obtener el estudiante actualizado con las relaciones de carrera conectadas
      const studentWithCareers = await this.prisma.student.findUnique({
        where: { id },
        include: {
          careers: {
            include: {
              career: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!studentWithCareers) {
        throw new Error('Student not found after update');
      }

      // Aplicar DTO
      const studentDto: StudentDto = {
        id: studentWithCareers.id,
        email: studentWithCareers.email,
        identification: studentWithCareers.identification,
        name: studentWithCareers.name,
        photo: studentWithCareers.photo,
        careers: studentWithCareers.careers.map((careerConnection) => ({
          id: careerConnection.career.id,
          name: careerConnection.career.name,
        })),
      };

      return {
        success: true,
        data: studentDto,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return handleErrors(error);
    }
  }
  async editProfileEmployed(
    id: number,
    updateEmployed: UpdateEmplyedDto,
  ): Promise<IResponse<EmployeeDto>> {
    try {
      const usuario = await this.prisma.adminEmployee.findFirst({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          identification: true,
          position: true,
          careers: {
            select: {
              career: {
                select: { id: true, name: true },
              },
            },
          },
        },
      });

      if (!usuario) {
        return {
          success: false,
          data: null,
          error: {
            statusCode: 404,
            path: `/authentication/student/${id}`,
            message: `El estudiante con ID ${id} no fue encontrado.`,
            timestamp: new Date().toISOString(),
          },
        };
      }

      // Verifica si la contraseña no es nula antes de encriptarla
      const hashedPassword = updateEmployed.password
        ? await bcrypt.hash(updateEmployed.password, 10)
        : undefined;

      // Filtra los datos para evitar subir `null` o `undefined`
      const filteredUpdateData = Object.fromEntries(
        Object.entries({
          email: updateEmployed.email,
          identification: updateEmployed.identification,
          name: updateEmployed.name,
          password: hashedPassword,
          securityWord: updateEmployed.securityWord,
          position: updateEmployed.position,
        }).filter(([, v]) => v !== undefined && v !== null),
      );

      // Actualizar la información del estudiante
      await this.prisma.adminEmployee.update({
        where: { id },
        data: filteredUpdateData,
      });

      // Verificar si se enviaron nuevas carreras para actualizar
      if (updateEmployed.careerIds) {
        // Eliminar todas las relaciones previas del estudiante en la tabla intermedia
        await this.prisma.adminEmployeeCareer.deleteMany({
          where: { adminEmployeeId: id },
        });

        // Insertar las nuevas relaciones en la tabla intermedia StudentCareer
        const careerConnections = updateEmployed.careerIds.map((careerId) => ({
          adminEmployeeId: id,
          careerId: Number(careerId),
        }));

        await this.prisma.adminEmployeeCareer.createMany({
          data: careerConnections,
        });
      }

      // Obtener el estudiante actualizado con las relaciones de carrera conectadas
      const employedWithCareers = await this.prisma.adminEmployee.findUnique({
        where: { id },
        include: {
          careers: {
            include: {
              career: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!employedWithCareers) {
        throw new Error('Student not found after update');
      }

      // Aplicar DTO
      const employeeDto: EmployeeDto = {
        id: employedWithCareers.id,
        email: employedWithCareers.email,
        identification: employedWithCareers.identification,
        name: employedWithCareers.name,
        position: employedWithCareers.position,
        careers: employedWithCareers.careers.map((careerConnection) => ({
          id: careerConnection.career.id,
          name: careerConnection.career.name,
        })),
      };

      return {
        success: true,
        data: employeeDto,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return handleErrors(error);
    }
  }
}
