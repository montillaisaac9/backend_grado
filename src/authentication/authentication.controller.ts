import {
  Controller,
  Post,
  Body,
  Res,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import RegisterStudentDtoR from './dto/CreateStudentDto.dto';
import { AuthenticationService } from './authentication.service';
import LoginDto from './dto/login.dto';
import RegisterEmployeeDto from './dto/CreateEmployedDto.dto';
import { EmployeeDto } from './dto/empleado.dto';
import { StudentDto } from './dto/student.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateStudentDto } from './dto/UpdateStudentDto';
import { UpdateEmplyedDto } from './dto/UpdateEmployedDto';

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
  @UseInterceptors(FileInterceptor('image'))
  createStudent(
    @Body() createAuthenticationDto: RegisterStudentDtoR,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.authenticationService.createStudent(
      createAuthenticationDto,
      image.path,
    );
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
  @ApiOperation({ summary: 'Get profile of an student' })
  @ApiResponse({
    status: 200,
    description: 'View profile successfully',
    type: EmployeeDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Get('/student/:id')
  async PerfilStudent(@Param('id') id: string) {
    return this.authenticationService.getPerfilStudent(parseInt(id));
  }
  @ApiOperation({ summary: 'Get profile of an student' })
  @ApiResponse({
    status: 201,
    description: 'Profile retrieved successfully',
    type: StudentDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Get('/employed/:id')
  async PerfilEmployed(@Param('id') id: string) {
    return this.authenticationService.getPerfilEmployed(parseInt(id));
  }
  @ApiOperation({ summary: 'edit perfil a student' })
  @ApiResponse({
    status: 201,
    description: 'Student update successfully',
    type: StudentDto,
  })
  @Patch('/student/:id')
  @UseInterceptors(FileInterceptor('image'))
  editStudent(
    @Param('id') id: string,
    @Body() updateAuthenticationDto: UpdateStudentDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.authenticationService.editProfileStudent(
      parseInt(id),
      updateAuthenticationDto,
      image ? image.path : undefined,
    );
  }
  @ApiOperation({ summary: 'edit perfil a student' })
  @ApiResponse({
    status: 201,
    description: 'Student update successfully',
    type: StudentDto,
  })
  @Patch('/employed/:id')
  @UseInterceptors(FileInterceptor('image'))
  editEmployed(
    @Param('id') id: string,
    @Body() updateAuthenticationDto: UpdateEmplyedDto,
  ) {
    return this.authenticationService.editProfileEmployed(
      parseInt(id),
      updateAuthenticationDto,
    );
  }
}
