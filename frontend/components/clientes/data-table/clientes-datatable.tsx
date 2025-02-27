import { DataTable } from '@/components/data_table/data_table'
import { ClienteEntity } from '@/services/clientes/entities/cliente.entity'
import React from 'react'
import { ClientesColumns } from './clientes-columns'
import { PaginationMetadata } from '@/types/pagination'
type ClientesDataTableProps = {
  clientes: ClienteEntity[],
  pagination?: PaginationMetadata
}
export default function ClientesDataTable(
  { clientes, pagination }: ClientesDataTableProps
) {
  return (
    <DataTable
      isShowSearchInput
      pagination={pagination}
      data={clientes}
      columns={ClientesColumns}
    />
  )
}
