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
      isShowSearchInput={true}
      pagination={response.data.meta}
      columnToVariantFilter={{
        'keyToVariant': 'estado',
        'isSearchParam': true,
        'title': 'Estado',
        variants: [
          { value: 'TODOS', label: 'Todos' },
          { value: 'PENDIENTE', label: 'Pendiente' },
          { value: 'ENTREGADO', label: 'Entregado' },
          { value: 'EN_PROCESO', label: 'En proceso' },
          { value: 'CANCELADO', label: 'Cancelado' },
        ]
      }}
    />
  )
}
