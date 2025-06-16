import { ApiProperty } from '@nestjs/swagger';

// DTO simplificado para Dish en el contexto de attendance
export class AttendanceDishDto {
  @ApiProperty({ example: 1, description: 'ID del plato' })
  id: number;

  @ApiProperty({ example: 'Arroz con Pollo', description: 'Título del plato' })
  title: string;
}

// DTO simplificado para MenuItem en el contexto de attendance
export class AttendanceMenuItemDto {
  @ApiProperty({ example: 1, description: 'ID del elemento del menú' })
  id: number;

  @ApiProperty({ example: '2025-06-10T00:00:00Z', description: 'Fecha del menú' })
  date: string;

  @ApiProperty({ example: 'MONDAY', description: 'Día de la semana' })
  weekDay: string;

  @ApiProperty({ type: () => AttendanceDishDto, description: 'Información del plato' })
  dish: AttendanceDishDto;
}

// DTO simplificado para User en el contexto de attendance
export class AttendanceUserDto {
  @ApiProperty({ example: 1, description: 'ID del usuario' })
  id: number;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del usuario' })
  name: string;

  @ApiProperty({ example: 'V-12345678', description: 'Identificación del usuario' })
  identification: string;
}

// DTO principal para la respuesta de attendance
export class AttendanceResponseDto {
  @ApiProperty({ example: 1, description: 'ID de la asistencia' })
  id: number;

  @ApiProperty({ example: '2025-06-10T12:34:56Z', description: 'Fecha de creación de la asistencia' })
  createdAt: string;

  @ApiProperty({ type: () => AttendanceUserDto, description: 'Información del usuario' })
  user: AttendanceUserDto;

  @ApiProperty({ type: () => AttendanceMenuItemDto, description: 'Información del elemento del menú' })
  menuItem: AttendanceMenuItemDto;
}
