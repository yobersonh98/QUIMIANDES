import { VisualizarProveedor } from '@/components/proveedor/visualizar-proveedor';
import BackButtonLayout from '@/components/shared/back-button-layout';
import { ProveedorService } from '@/services/proveedor/provedor.service';
import { PageProps, PaginationSearchParamsPage } from '@/types/pagination'
import React from 'react'

export default async function VisualizarProveedorPage(props: PageProps<PaginationSearchParamsPage>) {
  const params = await props.params

  const {data} = await ProveedorService.getServerInstance().consultar(params?.id || '');
  if (!data) {
    return <div>No se encontro ningun proveedor</div>
  }
  return (
    <BackButtonLayout
      title='Detalles del Proveedor'
    >
          <div className="container mx-auto py-10">
      <VisualizarProveedor proveedor={data} />
    </div>
    </BackButtonLayout>
  )
}
