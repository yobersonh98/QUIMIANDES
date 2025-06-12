import ListarUsuarios from '@/components/user/listar-usuarios'
import ToggleFormUsuario from '@/components/user/toggle-usuario-form'
import { PageProps, PaginationSearchParamsPage } from '@/types/pagination'
import React from 'react'

export default async function Usuarios(props: PageProps<PaginationSearchParamsPage>) {
  const searchParams = await props.searchParams
  return (
    <div>
      <div className="flex justify-between my-4 font-bold">
        <h1
          className="text-3xl"
        >Usuarios</h1>
        <ToggleFormUsuario />
      </div>
      <ListarUsuarios
        pagination={searchParams}
      />
    </div>
  )
}
