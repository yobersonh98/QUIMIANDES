import { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity";

export interface EntregaProdcutoEntity {
  id: string;
  entregaId: string;
  detallePedidoId: string;
  cantidadDespachada: number;
  cantidadDespachar: number;
  cantidadEntregada: number;
  observaciones?: string;

  detallePedido?: DetallePedidoEntity
}