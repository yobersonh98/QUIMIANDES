import VisualizacionCliente from '@/components/clientes/vizualizacion-cliente'
import BackButtonLayout from '@/components/shared/back-button-layout'
import { ClienteService } from '@/services/clientes/clientes.service'
import { PageProps, PaginationSearchParamsPage } from '@/types/pagination'
import React from 'react'

export default async function ClientePage(props: PageProps<PaginationSearchParamsPage>) {
  const id = await props?.params?.id as string
  const {data} = await ClienteService.getServerInstance().consultar(id)
  if (!data) {
    return <div>No se encontro ningun cliente</div>
  }
  return (
    <BackButtonLayout
      title='Cliente'
    >
      <VisualizacionCliente  datosCliente={{
        nombre: data.nombre,
        documento: data.documento,
        direccion: data.direccion,
        telefono: data.telefono,
        email: data.email,
         tipoDocumento: data.tipoDocumento,
        idMunicipio: data.idMunicipio,
        zone: data.zonaBarrio,
        municipio: data.municipio?.nombre
      }}
      datosEntrega={
        data.lugaresEntrega?.map((lugar) => ({
          nombre: lugar.nombre,
          ciudad: lugar.ciudad?.nombre,
          direccion: lugar.direccion,
          contacto: lugar.contacto
        })) || []
      }
      />
    </BackButtonLayout>
  )
}
