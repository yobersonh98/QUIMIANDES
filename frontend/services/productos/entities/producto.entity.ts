import { Presentacion } from "@/services/presentacion/entity/presentacion.entity";
import { ProveedorEntity } from "@/services/proveedor/entities/proveedor.entity";

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


export type UnidadMedida = "UND" | "MG" | "GR" | "KG" | "LB" | "TON" | "ML" | "L" | "M3" | "GAL" | "ONZ" | "MM" | "CM" | "M" | "MTS" | "PULG" | "PIES" | "M2" | "TAZA" | "CDA" | "CTA"
