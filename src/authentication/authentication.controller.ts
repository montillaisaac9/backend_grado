import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import RegisterEmployedDto from './dto/registerEmployedDto.dto';
import RegisterStudentDtoR from './dto/registerStudentDto.dto';
import { AuthenticationService } from './authentication.service';
import { IResponse } from 'src/common/interfaces/response.interface';
import LoginDto from './dto/login.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Get(':id')
  getUser(@Param('id') id: string): IResponse<any> {
    if (id === '1') {
      return {
        success: true,
        data: { id: 1, name: 'John Doe' },
        error: null,
      };
    }
    throw new NotFoundException('User not found');
  }

  @Post('/register/employed')
  createEmployed(@Body() createAuthenticationDto: RegisterEmployedDto) {
    return this.authenticationService.createEmployee(createAuthenticationDto);
  }

  @Post('/register/student')
  createStudent(@Body() createAuthenticationDto: RegisterStudentDtoR) {
    return this.authenticationService.createStudent(createAuthenticationDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authenticationService.login(loginDto, res);
  }

  @Get()
  findAll() {
    return this.authenticationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authenticationService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authenticationService.remove(+id);
  }
}
