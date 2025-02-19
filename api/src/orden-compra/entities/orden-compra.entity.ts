import { Pedido } from '../../pedido/entities/pedido.entity';

export class OrdenCompra {
  id: string;
  pedido: Pedido;
  numeroOrden: string;
  fechaRequerimiento: Date;
  tiempoEntrega: number;
  pesoDespachado: number;
  remision?: string;
}
