import { EntregaPedidoService } from '@/services/entrega-pedido/entrega-pedido.service'
import { PaginationSearchParamsPage } from '@/types/pagination'
// import { DataTable } from '../data_table/data_table'
import React from 'react'
// import { EntregaColumns } from './lista-entegas-columns'
import CalendarioEntregas from './calendario-entregas'

export default async function TableEntregas(paginationDto: PaginationSearchParamsPage) {
  const response = await EntregaPedidoService.getServerIntance().listar(paginationDto)
  
  if (!response.data) {
    return <div>No se encontraron entregas</div>
  }

  const entregas = response.data.data

  // return (
  //   <DataTable
  //     columns={EntregaColumns}
  //     data={entregas}
  //     isShowSearchInput={true}
  //     pagination={response.data.meta}
  //     columnToVariantFilter={{
  //       keyToVariant: 'estado',
  //       isSearchParam: true,
  //       title: 'Estado',
  //       variants: [
  //         { value: 'TODOS', label: 'Todos' },
  //         { value: 'PENDIENTE', label: 'Pendiente' },
  //         { value: 'EN_TRANSITO', label: 'En Transito'},
  //         { value: 'ENTREGADO', label: 'Entregado' },
  //         { value: 'CANCELADO', label: 'Cancelado' }
  //       ]
  //     }}
  //   />
  // )

  return (
    <CalendarioEntregas 
      entregas={entregas}
    />
  )
}
