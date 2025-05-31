import { EstadoDetallePedido } from "../entity/detalle-pedido.entity"

export interface UpdateDetallePedidoModel {
  id: string
  estado?: EstadoDetallePedido
  pedidoId?:string
}