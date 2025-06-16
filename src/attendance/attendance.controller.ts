import { Controller, Post, Body, Param, UseGuards, Get } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { PaginationDto } from 'src/common/dto/paginationParams.dto';
import { AuthGuard } from 'src/auth-guard/auth-guard.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('attendance')
@UseGuards(AuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva asistencia' })
  @ApiResponse({ status: 201, description: 'Asistencia creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El usuario ya registró asistencia para este elemento del menú' })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Post('/user/:userId/menu-item/:menuItemId')
  @ApiOperation({ summary: 'Buscar asistencia específica por usuario y elemento del menú' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiParam({ name: 'menuItemId', description: 'ID del elemento del menú' })
  @ApiResponse({ status: 200, description: 'Asistencia encontrada o null si no existe' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  findByUserAndMenuItem(
    @Param('userId') userId: string,
    @Param('menuItemId') menuItemId: string,
  ) {
    return this.attendanceService.findByUserAndMenuItem(+userId, +menuItemId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Roles(Role.EMPLOYEE)
  @Post('/menu/:id')
  @ApiOperation({ summary: 'Obtener asistencias por elemento del menú' })
  @ApiParam({ name: 'id', description: 'ID del elemento del menú' })
  @ApiResponse({ status: 200, description: 'Lista de asistencias obtenida exitosamente' })
  @ApiResponse({ status: 403, description: 'Acceso denegado - Solo ADMIN o EMPLOYEE' })
  finByMenuId(@Param('id') id: string, @Body() pagination: PaginationDto) {
    return this.attendanceService.finByMenuId(+id, pagination);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Roles(Role.EMPLOYEE)
  @Post('/user/:userId')
  @ApiOperation({ summary: 'Obtener asistencias por usuario' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de asistencias del usuario obtenida exitosamente' })
  @ApiResponse({ status: 403, description: 'Acceso denegado - Solo ADMIN o EMPLOYEE' })
  findByUserId(@Param('userId') userId: string, @Body() pagination: PaginationDto) {
    return this.attendanceService.findByUserId(+userId, pagination);
  }
}
