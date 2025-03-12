
export interface CrearDetallePedidoModel {
  pedidoId: string;

  productoId: string;

  unidades: number;

  cantidad: number;

  total: number;

  idLugarEntrega: string;

  tipoEntrega: string;

  fechaRequerimiento: Date;
}
