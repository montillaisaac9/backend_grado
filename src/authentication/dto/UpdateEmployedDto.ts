import { PartialType } from '@nestjs/swagger';
import CreateEmployeeDto from './CreateEmployedDto.dto';

export class UpdateEmplyedDto extends PartialType(CreateEmployeeDto) {}
