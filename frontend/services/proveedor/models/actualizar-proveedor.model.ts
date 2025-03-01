import { CrearProveedorModel } from "./crear-proveedor.model";

export interface ActualizarProveedorModel extends Partial<CrearProveedorModel> {
  id?: string;
}