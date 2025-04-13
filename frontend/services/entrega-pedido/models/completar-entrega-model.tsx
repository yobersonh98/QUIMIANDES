

export interface CompletarEntregaModel {
  entregaId: string
  entregaProductos: {
    entregaProductoId: string
    detallePedidoId: string
    observaciones?: string
    cantidadEntregada: number
  }[]
}