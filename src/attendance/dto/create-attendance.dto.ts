import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty({ 
    example: 1, 
    description: 'ID del usuario que registra la asistencia' 
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ 
    example: 1, 
    description: 'ID del elemento del menú al cual asiste el usuario' 
  })
  @IsInt()
  @IsNotEmpty()
  menuItemId: number;
}
