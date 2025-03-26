import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateAttendanceDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  menuId: number;
}
