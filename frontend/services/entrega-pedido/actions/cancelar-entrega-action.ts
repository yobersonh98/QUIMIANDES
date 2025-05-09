"use server"

import { ActionResponse } from "@/types/actions"
import { EntregaPedidoService } from "../entrega-pedido.service"

export const cancelarEntregaAction = async (
  entregaId:string,
):Promise<ActionResponse> => {
  const response  = await EntregaPedidoService.getServerIntance().cancelarEntrega(entregaId);
  return response.toActionResponse();
}