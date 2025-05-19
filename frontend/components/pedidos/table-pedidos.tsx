import { PedidoService } from "@/services/pedidos/pedido.service"
import type { PaginationSearchParamsPage } from "@/types/pagination"
import { ClientTablePedidos } from "./client-table-pedidos"

export default async function TablePedidos(paginationDto: PaginationSearchParamsPage) {
  const response = await PedidoService.getServerIntance().listar(paginationDto)
  
  if (!response.data) {
    return <div>No se encontraron pedidos</div>
  }
  const pedidos = response.data.data

  return <ClientTablePedidos data={pedidos} pagination={response.data.meta} />
}