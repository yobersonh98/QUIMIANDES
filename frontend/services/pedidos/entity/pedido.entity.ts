import { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity";

export interface PedidoEntity {
  id: string;
  fechaRecibido: Date;
  idCliente: string
  estado: EstadoPedido;
  observaciones?: string;
  fechaRequerimiento: Date;
  fechaEntrega?: Date;
  ordenCompra?:string;
  tiempoEntrega?: number;
  pesoDespachado?: number;
  detallesPedido: DetallePedidoEntity[];
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
