import { Proveedor } from '../../proveedor/entities/proveedor.entity';

export class Producto {
  id: string;
  nombre: string;
  tipo: string;
  unidadMedida: string;
  pesoVolumen: number;
  precioBase: number;
  proveedor: Proveedor;
}
