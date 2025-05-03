import EditarClienteForm from '@/components/clientes/editar-cliente-form'
import BackButtonLayout from '@/components/shared/back-button-layout'
import { ClienteService } from '@/services/clientes/clientes.service'
import React from 'react'
type ClientePageProps = {
  params: Promise< {
    id: string
}>
}
export default async function page( props: ClientePageProps) {
  const params = await props.params
  const {data} = await ClienteService.getServerInstance().consultar(params.id)
  if (!data) {
    return <div>No se encontro ningun cliente</div>
  }
  return (
    <BackButtonLayout
      title='Modificar Cliente'
    >
      <EditarClienteForm  
      clientId={data.id}
      initialData={data}
    />
    </BackButtonLayout>
  )
}
