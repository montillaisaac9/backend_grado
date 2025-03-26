import { Controller, Post, Body, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { PaginationDto } from 'src/common/dto/paginationParams.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Post('/menu/:id')
  finByMenuId(@Param('id') id: string, @Body() pagination: PaginationDto) {
    return this.attendanceService.finByMenuId(+id, pagination);
  }
}
