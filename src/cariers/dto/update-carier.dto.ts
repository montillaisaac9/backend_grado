import { PartialType } from '@nestjs/swagger';
import { CreateCareerDto } from './create-carier.dto';

export class UpdateCarierDto extends PartialType(CreateCareerDto) {}
