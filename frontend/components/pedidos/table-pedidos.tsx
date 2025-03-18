import { PedidoService } from '@/services/pedidos/pedido.service'
import { PaginationSearchParamsPage } from '@/types/pagination'
import React from 'react'
import { DataTable } from '../data_table/data_table';
import { PedidoColumns } from './table-pedidos-columns';

export default async function TablePedidos(paginationDto: PaginationSearchParamsPage) {
  const response = await PedidoService.getServerIntance().listar(paginationDto);
  if (!response.data) {
    return (
      <div>
        No se encontraron pedidos
      </div>
    )
  }
  const pedidos = response.data.data;
  return (
     <DataTable
      columns={PedidoColumns}
      data={pedidos}
     />
  )
}
