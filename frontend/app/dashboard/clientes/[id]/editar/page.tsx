import { ClientForm } from '@/components/clientes/client-form'
import BackButtonLayout from '@/components/shared/back-button-layout'
import { ClienteService } from '@/services/clientes/clientes.service'
import { PageProps, PaginationSearchParamsPage } from '@/types/pagination'
import React from 'react'

export default async function Page(props: PageProps<PaginationSearchParamsPage>) {
  const params = await props.params;
  const { data } = await ClienteService.getServerInstance().consultar(params?.id || '')
  
  if (!data) {
    return <div>No se encontró ningún cliente</div>
  }

  return (
    <BackButtonLayout title="Modificar Cliente">
      <ClientForm 
        mode="edit"
        clientData={data}
      />
    </BackButtonLayout>
  )
}