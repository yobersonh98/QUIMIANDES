import EditarClienteForm from '@/components/clientes/editar-cliente-form'
import { ClienteService } from '@/services/clientes/clientes.service'
import React from 'react'
type ClientePageProps = {
  params: {
      id: string
  }
}
export default async function page( {params}: ClientePageProps) {
  const {id } = await params
  const {data} = await ClienteService.getInstance().consultar(id)
  if (!data) {
    return <div>No se encontro ningun cliente</div>
  }
  return (
    <EditarClienteForm  
      clientId={data.id}
      initialData={data}
    />
  )
}
