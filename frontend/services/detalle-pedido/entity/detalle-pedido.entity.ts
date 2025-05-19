import { EntregaProdcutoEntity } from "@/services/entrega-pedido/entities/entrega-producto.entity";
import { LugarEntregaEntity } from "@/services/lugares-entrega/entity/lugar-entrega.entity";
import { UnidadMedida } from "@/services/productos/entities/producto.entity";

export type EstadoDetallePedido = 
  | "PENDIENTE"
  | "EN_TRANSITO"
  | "PARCIAL"
  | "ENTREGADO"
  | "CANCELADO";

export interface DetallePedidoEntity {
  id: string;

  pedidoId?: string;

  pedido?: {
  cliente?: {
    direccion?: string;
  }
}

  productoId: string;

  producto: {
    nombre: string;
    id: string;
    unidadMedida: UnidadMedida
  };
  estado: EstadoDetallePedido;
  unidades: number;

  cantidad: number;
  pesoTotal: number;
  codigo: string;

  cantidadDespachada: number;
  cantidadEntregada: number;
  cantidadProgramada: number;

  pesoRecibido: number;

  lugarEntregaId?: string;

  entregasDetallePedido?: EntregaProdcutoEntity[];
  lugarEntrega?: LugarEntregaEntity;

  tipoEntrega: string;

  fechaEntrega: Date;
}