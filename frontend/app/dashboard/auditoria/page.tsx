import ListaAuditoria from '@/components/auditoria/lista-auditoria-table'
import { PageProps, PaginationSearchParamsPage } from '@/types/pagination'
import React from 'react'

export default async function Productos(props: PageProps<PaginationSearchParamsPage>) {
  const searchParams = await props.searchParams
  return (
    <div>
      <div className="flex mb-2 justify-between font-bold">
        <h1
          className="text-3xl"
        >Auditoría</h1>

      </div>
      <ListaAuditoria
        pagination={searchParams}
      />
    </div>
  )
}
