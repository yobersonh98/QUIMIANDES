import { ProductoEntity } from "@/services/productos/entities/producto.entity";

export interface Presentacion {
  id: string;
  nombre: string;
  descripcion: string;
  productos?: ProductoEntity[];
}
