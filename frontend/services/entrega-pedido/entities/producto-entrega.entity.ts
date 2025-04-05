export interface ProductoEntregaEntity {
  id: string;
  entregaId: string;
  detallePedidoId: string;
  cantidadDespachada: number;
  cantidadDespachar: number;
  cantidadEntregada: number;
  observaciones?: string;
}