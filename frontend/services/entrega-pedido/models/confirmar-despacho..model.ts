export interface ConfirmarEntregaModel {
  entregaId: string
  remision?:string
  observaciones?:string
  despachosEntregaProducto: {
    entregaProductoId: string
    cantidadDespachada: number
    observaciones?: string
  }[]
}