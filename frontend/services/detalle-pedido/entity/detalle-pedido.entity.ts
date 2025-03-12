
export interface DetallePedidoEntity {
  id: string;
  idPedido: string
  idProducto: string;
  unidades: number;
  cantidad: number;
  total: number;
  fechaRequerimiento: Date;
}
