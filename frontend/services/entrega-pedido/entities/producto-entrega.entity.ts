export interface ProductoEntregaEntity {
  id: string;
  detallePedidoId: string;
  cantidadDespachada: number;
  cantidadDespachar: number;
  cantidadEntregada: number;
  observaciones?: string;
}