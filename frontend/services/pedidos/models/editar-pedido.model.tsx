import { EstadoPedido, PedidoEntity } from "../entity/pedido.entity";
import { EditarDetallePedidoModel } from "./editar-detalle-pedido.model";

export interface EditarPedidoModel extends Omit<Partial<PedidoEntity>, 'detallesPedido'> {
  estado?: EstadoPedido,
  detallesPedido: EditarDetallePedidoModel[]
}