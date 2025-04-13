export interface ConfirmarEntregaModel {
  entregaId: string
  despachosEntregaProducto: {
    entregaProductoId: string
    cantidadDespachada: number
    observaciones?: string
  }[]
}