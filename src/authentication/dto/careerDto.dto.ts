import { ApiProperty } from '@nestjs/swagger';

export class CareerDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Ingeniería en Informática' })
  name: string;
}
