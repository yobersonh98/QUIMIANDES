export class CreateEntregaProductoDto {
  id:string 
  entregaId    :   string
  detallePedidoId: string
  cantidadDespachada: number 
  fechaEntrega   ?: string
  observaciones    ?:  string
}
