import { DataTable } from '@/components/data_table/data_table'
import { PaginationSearchParamsPage } from '@/types/pagination'
import React from 'react'
import { AuditoriaColumns } from './lista-auditoria-columns'
import { AuditoriaService } from '@/services/auditoria/auditoria.service'
type Props = {
  pagination?: PaginationSearchParamsPage
}

export default async function ListaAuditoriaConSearchParams({ pagination }: Props) {
  const { data, error } = await AuditoriaService.getInstance().listar(pagination)

  if (error) {
    return <div>Ocurrió un error {error.message}</div>
  }

  return (
    <DataTable 
      data={data?.data || []}
      columns={AuditoriaColumns}
      pagination={data?.meta}
      isShowSearchInput
      dateFilters={{
        showDateFilters: true,
        isSearchParam: true, // Se envían como parámetros de URL al backend
        startDateLabel: "Fecha desde",
        endDateLabel: "Fecha hasta"
      }}
    />
  )
}