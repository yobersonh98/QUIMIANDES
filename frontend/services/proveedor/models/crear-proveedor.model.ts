
export interface CrearProveedorModel {
  documento: string;
  tipoDocumento: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  facturaIva: boolean;
}