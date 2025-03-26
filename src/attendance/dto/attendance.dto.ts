export class AttendanceResponseDto {
  id: number;
  userId: number;
  menuId: number;
  createdAt: Date;
  user: {
    id: number;
    name: string;
    identification: string;
  };
}
