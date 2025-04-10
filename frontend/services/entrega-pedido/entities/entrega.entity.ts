import { PedidoEntity } from "@/services/pedidos/entity/pedido.entity";
import { EntregaProdcutoEntity } from "./entrega-producto.entity";

export type EstadoEntrega =
  | "PENDIENTE"
  | "EN_TRANSITO"
  | "ENTREGADO"
  | "CANCELADO"

export interface EntregaEntity {
  id: string;
  pedidoId: string;
  vehiculoInterno?: string;
  vehiculoExterno?: string;
  entregadoPorA: string;
  estado: EstadoEntrega;
  remision?: string;
  observaciones?: string;

  pedido?:PedidoEntity

  entregaProductos?: EntregaProdcutoEntity[]
}
