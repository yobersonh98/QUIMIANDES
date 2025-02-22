import { DataTable } from '@/components/data_table/data_table'
import { ClienteEntity } from '@/services/clientes/entities/cliente.entity'
import React from 'react'
import { ClientesColumns } from './clientes-columns'
type ClientesDataTableProps ={
  clientes: ClienteEntity[]
}
export default function ClientesDataTable(
  {clientes} : ClientesDataTableProps
) {
  return (
    
    <DataTable
    data={clientes}
    columns={ClientesColumns}
  />
  )
}
