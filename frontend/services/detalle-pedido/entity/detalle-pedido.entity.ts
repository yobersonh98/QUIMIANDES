import { ProductoEntregaEntity } from "@/services/entrega-pedido/entities/producto-entrega.entity";

export interface DetallePedidoEntity {
  id: string;

  pedidoId?: string;

  productoId: string;

  producto: {
    nombre: string;
    id: string;
  };

  unidades: number;

  cantidad: number;

  cantidadDespachada: number;
  cantidadEntregada: number;

  pesoRecibido: number;

  lugarEntregaId?: string;

  entregasDetallePedido: ProductoEntregaEntity[];
  lugarEntrega: {
    nombre: string;
    id: string;
    ciudad: {
      nombre: string;
    }
  };

  tipoEntrega: string;

  fechaEntrega: Date;
}