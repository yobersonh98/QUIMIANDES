import { EntregaProdcutoEntity } from "@/services/entrega-pedido/entities/entrega-producto.entity";

export type EstadoDetallePedido = 
  | "PENDIENTE"
  | "EN_TRANSITO"
  | "PARCIAL"
  | "ENTREGADO"
  | "CANCELADO";

export interface DetallePedidoEntity {
  id: string;

  pedidoId?: string;

  productoId: string;

  producto: {
    nombre: string;
    id: string;
  };
  estado: EstadoDetallePedido;
  unidades: number;

  cantidad: number;
  codigo: string;

  cantidadDespachada: number;
  cantidadEntregada: number;
  cantidadProgramada: number;

  pesoRecibido: number;

  lugarEntregaId?: string;

  entregasDetallePedido?: EntregaProdcutoEntity[];
  lugarEntrega: {
    nombre: string;
    id: string;
    direccion?: string;
    ciudad: {
      nombre: string;
    }
  };

  tipoEntrega: string;

  fechaEntrega: Date;
}