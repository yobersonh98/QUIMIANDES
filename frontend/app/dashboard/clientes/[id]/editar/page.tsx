import { ClientForm } from '@/components/clientes/client-form'
import BackButtonLayout from '@/components/shared/back-button-layout'
import { ClienteService } from '@/services/clientes/clientes.service'
import React from 'react'

type ClientePageProps = {
  params: {
    id: string
  }
}

export default async function Page({ params }: ClientePageProps) {
  const { data } = await ClienteService.getServerInstance().consultar(params.id)
  
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