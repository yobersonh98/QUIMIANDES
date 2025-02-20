import { Pedido } from '../../pedido/entities/pedido.entity';
import { Producto } from '../../producto/entities/producto.entity';

export class DetallePedido {
  id: string;
  pedido: Pedido;
  producto: Producto;
  unidades: number;
  cantidad: number;
  total: number;
}
