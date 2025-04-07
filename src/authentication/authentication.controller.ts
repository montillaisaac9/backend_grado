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
import { AuthenticationService } from './authentication.service';
import LoginDto from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from './dto/UserDto.dto';
import CreateUserDto from './dto/createUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { Logger } from '@nestjs/common';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiOperation({ summary: 'Register a User' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: UserDto,
  })
  @Post('/register')
  @UseInterceptors(FileInterceptor('image'))
  createStudent(
    @Body() createAuthenticationDto: CreateUserDto,
    @UploadedFile() image: Express.Multer.File | undefined,
  ) {
    // Convertir el DTO a JSON y loguearlo
    Logger.log('Received DTO:', JSON.stringify(createAuthenticationDto));
    
    // Log de la imagen (si existe)
    Logger.log('Received image:', image ? image.path : 'No image provided');
    
    return this.authenticationService.createUser(
      createAuthenticationDto,
      image ? image.path : undefined,
    );
  }

  @ApiOperation({ summary: 'Login a session' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: UserDto,
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
  @ApiOperation({ summary: 'Get profile' })
  @ApiResponse({
    status: 200,
    description: 'View profile successfully',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Get('/perfil/:id')
  async PerfilStudent(@Param('id') id: string) {
    return this.authenticationService.getPerfil(parseInt(id));
  }
  @ApiOperation({ summary: 'edit perfil' })
  @ApiResponse({
    status: 201,
    description: 'Student update successfully',
    type: UserDto,
  })
  @Patch('/edit/:id')
  @UseInterceptors(FileInterceptor('image'))
  editStudent(
    @Param('id') id: string,
    @Body() updateAuthenticationDto: UpdateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.authenticationService.editProfileStudent(
      parseInt(id),
      updateAuthenticationDto,
      image ? image.path : undefined,
    );
  }
}
