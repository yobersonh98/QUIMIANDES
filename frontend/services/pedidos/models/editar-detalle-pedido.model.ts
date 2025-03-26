import { CrearDetallePedidoModel } from "./crear-detalle-pedido.mode";

export interface EditarDetallePedidoModel extends Partial<CrearDetallePedidoModel> {
  id?:string
}