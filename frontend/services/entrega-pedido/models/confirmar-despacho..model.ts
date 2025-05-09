export interface ConfirmarEntregaModel {
  entregaId: string
  remision?:string
  despachosEntregaProducto: {
    entregaProductoId: string
    cantidadDespachada: number
    observaciones?: string
  }[]
}