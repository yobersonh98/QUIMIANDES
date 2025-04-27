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
  pedidoDocumentos?: PedidoDocumentoEntity[]
  cliente: {
    nombre: string;
    id: string;
    documento: string;
  }
}
export type EstadoPedido = "PENDIENTE" | "EN_PROCESO"  | "ENTREGADO" | "CANCELADO" ;
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


export interface DocumentoEntity {
  id: string
  fileName: string
  originalName: string
  mimeType: string
  size: number
  url: string
  path: string
  description?: string
  tipo?:string
  fechaCreacion?: string
}
export interface PedidoDocumentoEntity {
  documentoId:string
  pedidoId:string
  documento: DocumentoEntity
}