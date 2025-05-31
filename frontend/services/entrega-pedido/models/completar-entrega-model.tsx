

export interface CompletarEntregaModel {
  entregaId: string
  observaciones?:string
  entregaProductos: {
    entregaProductoId: string
    detallePedidoId: string
    observaciones?: string
    cantidadEntregada: number
  }[]
}