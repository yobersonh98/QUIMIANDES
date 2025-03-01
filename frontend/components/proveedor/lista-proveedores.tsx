import { ProveedorEntity } from '@/services/proveedor/entities/proveedor.entity'
import { PaginationMetadata } from '@/types/pagination'
import React from 'react'
import { DataTable } from '../data_table/data_table'
import { ProveedoresColumns } from './proveedores-columns-table'
type Props = {
  pagination: PaginationMetadata
  proveedores: ProveedorEntity[]
}

export default function ListaProveedores({
  pagination,
  proveedores
}: Props) {
  return (
    <DataTable 
      isShowSearchInput
      pagination={pagination}
      data={proveedores}
      columns={ProveedoresColumns}
    />
  )
}
