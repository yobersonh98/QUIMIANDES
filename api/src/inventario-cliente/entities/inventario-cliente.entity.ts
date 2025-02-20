import { Cliente } from '../../cliente/entities/cliente.entity';
import { Producto } from '../../producto/entities/producto.entity';

export class InventarioCliente {
  id: string;
  cliente: Cliente;
  producto: Producto;
  precioEspecial: number;
}
