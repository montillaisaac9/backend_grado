import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CareerDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Ingeniería en Informática' })
  name: string;
}

export class UserDto {
  @ApiProperty({ example: 2 })
  id: number;

  @ApiProperty({ example: 'user@unerg.edu.ve' })
  email: string;

  @ApiProperty({ example: '87654321' })
  identification: string;

  @ApiProperty({ example: 'María González' })
  name: string;

  @ApiProperty({ example: 'foto_url.jpg', nullable: true })
  photo: string | null;

  @ApiProperty({ example: 'PalabraSecreta' })
  securityWord: string;

  @ApiProperty({ enum: Role, example: Role.STUDENT })
  role: Role;

  @ApiProperty({ example: 'Director', nullable: true })
  position?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ type: [CareerDto], nullable: true })
  careers?: CareerDto[];
}
