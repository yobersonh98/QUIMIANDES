
import { DetallePedido } from '@prisma/client';
export type DetallePedidoEntity =  DetallePedido & {
  cantidadEntregada?: number;
  cantidadDespachada?: number;
}
