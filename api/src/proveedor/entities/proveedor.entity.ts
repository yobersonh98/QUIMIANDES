import { Producto } from '../../producto/entities/producto.entity';

export class Proveedor {
  documento: string;
  tipoDocumento: string;
  nombre: string;
  direccion: string;
  productos: Producto[];
}
