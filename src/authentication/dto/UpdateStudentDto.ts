import { PartialType } from '@nestjs/swagger';
import CreateStudentDto from './CreateStudentDto.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}
