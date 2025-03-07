import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import RegisterStudentDtoR from './dto/registerStudentDto.dto';
import { AuthenticationService } from './authentication.service';
import LoginDto from './dto/login.dto';
import RegisterEmployeeDto from './dto/registerEmployedDto.dto';
import { EmployeeDto } from './dto/empleado.dto';
import { StudentDto } from './dto/student.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiOperation({ summary: 'Register an employee' })
  @ApiResponse({
    status: 201,
    description: 'Employee registered successfully',
    type: EmployeeDto,
  })
  @Post('/register/employed')
  createEmployed(@Body() createAuthenticationDto: RegisterEmployeeDto) {
    return this.authenticationService.createEmployee(createAuthenticationDto);
  }

  @ApiOperation({ summary: 'Register a student' })
  @ApiResponse({
    status: 201,
    description: 'Student registered successfully',
    type: StudentDto,
  })
  @Post('/register/student')
  createStudent(@Body() createAuthenticationDto: RegisterStudentDtoR) {
    return this.authenticationService.createStudent(createAuthenticationDto);
  }

  @ApiOperation({ summary: 'Login an employee or student' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: EmployeeDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Login successful',
    type: StudentDto,
  })
  @Post('/login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const response = await this.authenticationService.login(loginDto, res);
    return res.json(response);
  }
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @Post('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authenticationService.logout(res);
  }
  @ApiOperation({ summary: 'Change Password' })
  @ApiResponse({
    status: 200,
    description: 'Change Password successful',
  })
  @Post('/changePassword')
  changePassword(@Body() createAuthenticationDto: ChangePasswordDto) {
    return this.authenticationService.changePassword(createAuthenticationDto);
  }
}
