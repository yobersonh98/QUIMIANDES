import { Presentacion } from "@/services/presentacion/entity/presentacion.entity";
import { ProveedorEntity } from "@/services/proveedor/entities/proveedor.entity";
import { UnidadMedida } from "@/types/unidades";

export interface ProductoEntity {
  id: string;
  nombre: string;
  tipo: string;
  unidadMedida: UnidadMedida;
  pesoVolumen: number;
  precioBase: number;
  presentacion?: Presentacion;
  proveedor?: ProveedorEntity;
  idPresentacion: string;
  idProveedor: string;

  nombrePresentacion?: string;
  nombreProveedor?: string;
}
