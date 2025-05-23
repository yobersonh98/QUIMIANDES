import { OrderForm } from '@/components/pedidos/order-form';
import BackButtonLayout from '@/components/shared/back-button-layout';
import { PedidoService } from '@/services/pedidos/pedido.service';
import { PageProps, PaginationSearchParamsPage } from '@/types/pagination'
import React from 'react'

export default async function Page(props: PageProps<PaginationSearchParamsPage>) {

  const params = await props.params;
  const response = await PedidoService.getServerIntance().consultar(params?.id || '');

  if (!response.data) {
    return <div>
      {response.error?.message || 'No se econtro el pedido...'}
    </div>
  }
  return (
    <BackButtonLayout
      title={`Modificar Pedido: ${response.data.codigo || ''}`}
    >
      <OrderForm
        pedido={response.data}
        pathNameToRefresh='/dashboard/pedidos'
      />
    </BackButtonLayout>
  )
}
