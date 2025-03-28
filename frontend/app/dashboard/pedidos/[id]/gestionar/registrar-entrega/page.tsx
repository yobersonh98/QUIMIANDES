import { CrearEntregaForm } from '@/components/entregas/crear-entrega-form'
import BackButtonLayout from '@/components/shared/back-button-layout'
import { PedidoService } from '@/services/pedidos/pedido.service';
import { PageProps, PaginationSearchParamsPage } from '@/types/pagination'
import React from 'react'

export default async function RegistrarEntregaPage(props: PageProps<PaginationSearchParamsPage>) {
  const params = await props.params;
  const response = await PedidoService.getServerIntance().consultar(params?.id || '');
  if (!response.data) {
    return <div>
      {response.error?.message || 'No se econtro el pedido...'}
    </div>
  }
  return (
    <BackButtonLayout title="Registrar Entrega">
      <CrearEntregaForm
        pedido={response.data}
      />
    </BackButtonLayout>
  )
}
