export class ChangePasswordDto {
  correo: string;
  role: 'admin' | 'estudiante';
  palabra_seguridad: string;
  nuevaContraseña: string;
}
