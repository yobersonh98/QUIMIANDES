interface EntregaResumen {
  id: string
  codigo: string
  estado: string
  fechaEntrega?: string
  fechaCreacion: string
  observaciones?: string
  remision?: string
  vehiculoInterno?: string
  vehiculoExterno?: string
  cantidadProductos: number
  pedido: {
    cliente: {
      nombre: string
    }
  }
  entregaProductos: {
    id: string
    cantidadDespachar: number
    detallePedido?: {
      producto: { nombre: string }
      lugarEntrega?: {
        id: string
        nombre: string
        direccion?: string
        ciudad: {
          nombre: string
        }
      }
    }
  }[]
}
