import { CrearProductoModel } from "./crear-producto.model";

export interface ActualizarProductoModel  extends Partial<CrearProductoModel> {
  id: string;
}