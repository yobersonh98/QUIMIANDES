export interface CrearEntregaProductoModel {
  entregaId?:   string
  detallePedidoId: string
  cantidadDespachada: number
  fechaEntrega?: string
  observaciones?:  string
}