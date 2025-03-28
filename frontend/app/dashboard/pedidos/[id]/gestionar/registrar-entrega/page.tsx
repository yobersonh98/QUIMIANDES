import { CrearEntregaForm } from '@/components/entregas/crear-entrega-form'
import BackButtonLayout from '@/components/shared/back-button-layout'
import { PageProps, PaginationSearchParamsPage } from '@/types/pagination'
import React from 'react'

export default async function RegistrarEntregaPage(props: PageProps<PaginationSearchParamsPage>) {
  const params = await props.params
  return (
    <BackButtonLayout title="Registrar Entrega">
      <CrearEntregaForm
        pedidoId={params?.id || ''}
      />
    </BackButtonLayout>
  )
}
