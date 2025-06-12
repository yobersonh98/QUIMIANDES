import ListaFuncionalidades from '@/components/funcionalidad/lista'
import ToggleFormFuncionalidad from '@/components/funcionalidad/toggle-form-funcionalidad'
import { PageProps, PaginationSearchParamsPage } from '@/types/pagination'
import React from 'react'

export default async function Funcionalidades(props: PageProps<PaginationSearchParamsPage>) {
  const searchParams = await props.searchParams
  return (
    <div>
      <div className="flex justify-between my-4 font-bold">
        <h1
          className="text-3xl"
        >Funcionalidades</h1>
        <ToggleFormFuncionalidad />
      </div>
      <ListaFuncionalidades
        pagination={searchParams}
      />
    </div>
  )
}
