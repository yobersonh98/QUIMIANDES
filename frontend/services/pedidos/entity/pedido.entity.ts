import { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity";

export interface PedidoEntity {
  id: string;
  fechaRecibido: Date;
  idCliente: string
  estado: string;
  observaciones?: string;
  fechaRequerimiento: Date;
  fechaEntrega?: Date;
  tiempoEntrega?: number;
  pesoDespachado?: number;
  productos: DetallePedidoEntity[];
  // entregas: Entrega[];
  // ordenesCompra: OrdenCompra[];
}