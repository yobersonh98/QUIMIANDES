import VisualizacionCliente from '@/components/clientes/vizualizacion-cliente'
import { ClienteService } from '@/services/clientes/clientes.service'
import React from 'react'
type ClientePageProps = {
  params: {
      id: string
  }
}
export default async function ClientePage({params}: ClientePageProps) {
  const {id } = await params
  const {data} = await ClienteService.getInstance().consultar(id)
  if (!data) {
    return <div>No se encontro ningun cliente</div>
  }
  return (
    <div>
      
      <VisualizacionCliente  datosCliente={{
        nombre: data.nombre,
        documento: data.documento,
        direccion: data.direccion,
        telefono: data.telefono,
        email: data.email,
         tipoDocumento: data.tipoDocumento,
        idMunicipio: data.idMunicipio,
        zone: data.zonaBarrio
      }}
      datosEntrega={data?.lugaresEntrega || []}
      />
    </div>
  )
}
