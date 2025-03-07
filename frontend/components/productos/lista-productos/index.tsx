import { DataTable } from '@/components/data_table/data_table'
import { ProductoService } from '@/services/productos/productos.service'
import { PaginationSearchParamsPage } from '@/types/pagination'
import React from 'react'
import { ProductosColumns } from './productos-columns'

type Props = {
  pagination?: PaginationSearchParamsPage
}

export default async function ListaProductos({ pagination }: Props) {
  const { data, error} = await ProductoService.getInstance().listar(pagination)

  if (error) {
    return <div>
      Ocurrio un error {error.message}
    </div>
  }
  return (
    <DataTable 
      data={data?.data || []}
      columns={ProductosColumns}
      pagination={data?.meta}
      isShowSearchInput
    />
  )
}
