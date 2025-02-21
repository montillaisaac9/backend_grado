export class EmpleadoAdminDTO {
  id?: number;
  correo: string;
  nombre: string;
  cargo: string;
  palabra_seguridad: string;
  cedula: string;
  contrasena: string;

  constructor(data: Partial<EmpleadoAdminDTO>) {
    this.id = data.id;
    this.correo = data.correo ?? '';
    this.nombre = data.nombre ?? '';
    this.cargo = data.cargo ?? '';
    this.palabra_seguridad = data.palabra_seguridad ?? '';
    this.cedula = data.cedula ?? '';
    this.contrasena = data.contrasena ?? '';
  }
}
