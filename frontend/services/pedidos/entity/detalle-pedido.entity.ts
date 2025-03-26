export interface DetallePedidoEntity {
  id: string
  pedidoId?: string;

  productoId: string;

  unidades: number;

  cantidad: number;

  lugarEntregaId?: string;

  tipoEntrega: string;

  fechaEntrega: Date;
}