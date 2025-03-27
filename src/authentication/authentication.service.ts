import { Injectable, BadRequestException } from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { PrismaService } from '../prisma/prisma.service';
import LoginDto from './dto/login.dto';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { handleErrors } from 'src/common/utils/error-handler';

import { UserDto } from './dto/UserDto.dto';
import CreateUserDto from './dto/createUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto';

@Injectable()
export class AuthenticationService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    register: CreateUserDto,
    url: string | undefined = undefined,
  ): Promise<IResponse<string>> {
    try {
      const hashedPassword = await bcrypt.hash(register.password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          email: register.email,
          identification: register.identification,
          name: register.name,
          password: hashedPassword,
          securityWord: register.securityWord,
          photo: url ? `http://localhost:3000/${url}` : undefined,
          role: register.role,
          position: register.position,
        },
      });

      const careerConnections = Array.isArray(register.careerIds)
        ? register.careerIds.map((careerId) => ({
            userId: newUser.id,
            careerId: Number(careerId), // Convertir a número
          }))
        : [];

      await this.prisma.userCareer.createMany({
        data: careerConnections,
      });

      return {
        success: true,
        data: 'Usuario creado correctamente',
        error: null,
      };
    } catch (error: unknown) {
      return handleErrors<string>(error);
    }
  }

  async login(loginDto: LoginDto, res: Response): Promise<IResponse<UserDto>> {
    try {
      const usuario = await this.prisma.user.findFirst({
        where: { email: loginDto.email },
        select: {
          id: true,
          email: true,
          name: true,
          position: true,
          password: true,
          securityWord: true,
          identification: true,
          role: true,
          photo: true,
          isActive: true,
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
      const jwtSecret = process.env.JWT_SECRET || 'default_secret_value';
      const token = jwt.sign(
        { id: usuario.id, role: usuario.role },
        jwtSecret,
        { expiresIn: '12h' },
      );
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
      });

      const usuarioDto = {
        id: usuario.id,
        email: usuario.email,
        name: usuario.name,
        identification: usuario.identification,
        role: usuario.role,
        securityWord: usuario.securityWord,
        position: usuario.position ?? undefined,
        isActive: true,
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
  ): Promise<IResponse<string>> {
    try {
      const usuario = await this.prisma.user.findFirst({
        where: { email: changePasswordDto.email },
        select: {
          id: true,
          email: true,
          name: true,
          position: true,
          password: true,
          securityWord: true,
          identification: true,
          role: true,
          photo: true,
          isActive: true,
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
      if (!usuario) {
        throw new BadRequestException('Correo no registrado');
      }
      if (usuario?.securityWord !== changePasswordDto.securityWord) {
        console.log(usuario);
        throw new BadRequestException('Palabra de seguridad incorrecta');
      }
      const hashedPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        10,
      );
      await this.prisma.user.update({
        where: { id: usuario.id },
        data: {
          password: hashedPassword,
        },
      });

      return {
        success: true,
        data: 'Contraseña actualizada correctamente',
        error: null,
      };
    } catch (error) {
      return handleErrors(error);
    }
  }

  async getPerfil(id: number): Promise<IResponse<UserDto>> {
    try {
      const usuario = await this.prisma.user.findFirst({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          position: true,
          password: true,
          securityWord: true,
          identification: true,
          role: true,
          photo: true,
          isActive: true,
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
        name: usuario.name,
        identification: usuario.identification,
        role: usuario.role,
        securityWord: usuario.securityWord,
        position: usuario.position ?? undefined,
        isActive: true,
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

  async editProfileStudent(
    id: number,
    updateStudentDto: UpdateUserDto,
    url: string | undefined = undefined,
  ): Promise<IResponse<UserDto>> {
    try {
      const usuario = await this.prisma.user.findFirst({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          position: true,
          password: true,
          securityWord: true,
          identification: true,
          role: true,
          photo: true,
          isActive: true,
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
      const hashedPassword = updateStudentDto.password
        ? await bcrypt.hash(updateStudentDto.password, 10)
        : undefined;

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
      await this.prisma.user.update({
        where: { id },
        data: filteredUpdateData,
      });

      // Verificar si se enviaron nuevas carreras para actualizar
      if (updateStudentDto.careerIds) {
        await this.prisma.userCareer.deleteMany({
          where: { userId: id },
        });

        // Insertar las nuevas relaciones en la tabla intermedia StudentCareer
        const careerConnections = updateStudentDto.careerIds.map(
          (careerId) => ({
            userId: id,
            careerId: Number(careerId),
          }),
        );

        await this.prisma.userCareer.createMany({
          data: careerConnections,
        });
      }

      // Obtener el estudiante actualizado con las relaciones de carrera conectadas
      const studentWithCareers = await this.prisma.user.findUnique({
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
      const user: UserDto = {
        id: studentWithCareers.id,
        email: studentWithCareers.email,
        identification: studentWithCareers.identification,
        name: studentWithCareers.name,
        photo: studentWithCareers.photo,
        role: studentWithCareers.role,
        securityWord: studentWithCareers.securityWord,
        position: studentWithCareers.position ?? undefined,
        isActive: studentWithCareers.isActive,
        careers: studentWithCareers.careers.map((careerConnection) => ({
          id: careerConnection.career.id,
          name: careerConnection.career.name,
        })),
      };

      return {
        success: true,
        data: user,
        error: null,
      };
    } catch (error) {
      console.log(error);
      return handleErrors(error);
    }
  }
}
