"use server"

import { EntregaPedidoService } from "../entrega-pedido.service"
import { ConfirmarEntregaModel } from "../models/confirmar-despacho..model"

export const confirmarEntregaAction = async (
  data: ConfirmarEntregaModel,
) => {
  return await EntregaPedidoService.getServerIntance().confirmarEntrega(data)
}