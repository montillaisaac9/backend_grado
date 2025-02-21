import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import RegisterEmployedDto from './dto/registerEmployedDto.dto';
import { AuthenticationService } from './authentication.service';
import { IResponse } from 'src/common/interfaces/response.interface';

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

  @Post()
  create(@Body() createAuthenticationDto: RegisterEmployedDto) {
    return this.authenticationService.create(createAuthenticationDto);
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
