import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import CreateCommentDto from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginationDto } from 'src/common/dto/paginationParams.dto';
import { AuthGuard } from 'src/auth-guard/auth-guard.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from '@prisma/client';


@UseGuards(AuthGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Roles(Role.EMPLOYEE)
  @Post('/dish/:id')
  finByMenuId(@Param('id') id: string, @Body() pagination: PaginationDto) {
    return this.commentService.findAll(+id, pagination);
  }
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Roles(Role.EMPLOYEE)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
