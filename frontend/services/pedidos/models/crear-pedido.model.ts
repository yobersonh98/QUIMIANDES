import { CrearDetallePedidoModel } from './crear-detalle-pedido.mode';

export interface CrearPedidoModel {
  idCliente: string;

  observaciones?: string;

  fechaRequerimiento: Date;

  fechaEntrega?: Date;

  tiempoEntrega?: number;

  pesoDespachado?: number;

  detallesPedido: CrearDetallePedidoModel[]

}
