import { Producto } from "../../producto/entities/producto.entity";



export class Presentacion {
  id: string;
  nombre: string;
  descripcion: string;
  productos?: Producto[];
}
