
export interface CrearDetallePedidoModel {
  pedidoId?: string;

  productoId: string;

  unidades: number;

  cantidad: number;

  lugarEntregaId?: string;

  tipoEntrega: string;

  fechaEntrega: Date;
}
