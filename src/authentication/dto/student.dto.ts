export class EstudianteDTO {
  id: number;
  correo: string;
  cedula: string;
  nombre: string;
  carrera: string;
  contraseña: string;
  palabra_seguridad: string;
  foto?: string;

  constructor(data: Partial<EstudianteDTO>) {
    this.id = data.id ?? 0;
    this.correo = data.correo ?? '';
    this.cedula = data.cedula ?? '';
    this.nombre = data.nombre ?? '';
    this.carrera = data.carrera ?? '';
    this.contraseña = data.contraseña ?? '';
    this.palabra_seguridad = data.palabra_seguridad ?? '';
    this.foto = data.foto ?? '';
  }
}
