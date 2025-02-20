import { Pedido } from '../../pedido/entities/pedido.entity';

export class Entrega {
  id: string;
  pedido: Pedido;
  vehiculoInterno?: string;
  vehiculoExterno?: string;
  entregadoPorA: string;
  lugarEntrega: string;
  tipoEntrega: string;
  remision?: string;
  observaciones?: string;
}
