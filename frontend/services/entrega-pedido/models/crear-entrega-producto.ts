export interface CrearEntregaProductoModel {
  entregaId?:   string
  detallePedidoId: string
  cantidadDespachada?: number
  cantidadDespachar: number
  fechaEntrega?: string
  observaciones?:  string
}