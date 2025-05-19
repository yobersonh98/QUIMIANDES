import { CrearDetallePedidoModel } from './crear-detalle-pedido.mode';

export interface CrearPedidoModel {
  idCliente: string;

  observaciones?: string;

  fechaRecibido: Date;

  fechaEntrega?: Date;

  tiempoEntrega?: number;

  pesoDespachado?: number;

  detallesPedido: CrearDetallePedidoModel[]

  pedidoDocumentoIds?: string[];


}
