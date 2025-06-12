
export interface FuncionalidadEntity {
  id: string;
  nombre: string;
  descripcion: string | null;
  ruta: string | null;
  activo: boolean;
  icon: string | null;
  creadoEn: Date;
  actualizadoEn: Date;
}