import { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity";
import { EntregaEntity } from "@/services/entrega-pedido/entities/entrega.entity";

export interface PedidoEntity {
  id: string;
  fechaRecibido: Date;
  idCliente: string
  estado: EstadoPedido;
  observaciones?: string;
  fechaEntrega?: Date;
  ordenCompra?:string;
  tiempoEntrega?: number;
  pesoDespachado?: number;
  detallesPedido: DetallePedidoEntity[];
  entregas?: EntregaEntity[];
  cliente: {
    nombre: string;
    id: string;
    documento: string;
  }
}
export type EstadoPedido = "PENDIENTE" | "DESPACHADO" | "EN_TRANSITO" | "ENTREGADO" | "CANCELADO" | "APLAZADO" | "DEVUELTO"
export interface PedidoDataTable {
  id?:string;
  cliente?: {
    nombre?: string
  };
  idCliente?: string
  fechaRecibido?: string
  ordenCompra?: string
  estado?: EstadoPedido
  cantidadDetallesPedido?: number;
}
