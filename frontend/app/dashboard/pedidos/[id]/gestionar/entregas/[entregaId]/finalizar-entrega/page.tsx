import FinalizarEntrega from '@/components/entregas/finalizar-entrega';
import BackButtonLayout from '@/components/shared/back-button-layout'
import { ServiceResponse } from '@/core/service/service.response';
import { EntregaEntity } from '@/services/entrega-pedido/entities/entrega.entity';
import { EntregaPedidoService } from '@/services/entrega-pedido/entrega-pedido.service';
import { PageProps, PaginationSearchParamsPage, ParamsPage } from '@/types/pagination'
import React from 'react'

interface EntregarACliente extends ParamsPage  {
    entregaId: string
}

export default async function FinalizarEntregaPage(props: PageProps<PaginationSearchParamsPage, EntregarACliente>) {
  const params = await props.params;
  const  entrega:ServiceResponse<EntregaEntity> = await EntregaPedidoService.getServerIntance().consultar(params?.entregaId || '');
  if (!entrega.data) {
    return <div>
      {entrega.error?.message || 'No se econtro la entrega...'}
    </div>
  }
  return (
    <BackButtonLayout
      title="Finalizar Entrega"
    >
      <FinalizarEntrega />
    </BackButtonLayout>
  )
}
