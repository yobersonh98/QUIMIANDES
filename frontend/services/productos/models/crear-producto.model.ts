import { UnidadMedida } from "../entities/producto.entity";

export interface CrearProductoModel {
  nombre: string;
  tipo: string;
  unidadMedida: UnidadMedida;
  pesoVolumen: number;
  precioBase: number;
  idProveedor: string;
  idPresentacion: string;
}

