import ConsultarProducto from '@/components/productos/consultar-producto';
import ModificarProducto from '@/components/productos/modificar-producto';
import BackButtonLayout from '@/components/shared/back-button-layout';
import { PageProps, PaginationSearchParamsPage } from '@/types/pagination'
import React from 'react'

export default async function page(props: PageProps<PaginationSearchParamsPage>) {
  const id = await props.params?.id;

  return (
    <BackButtonLayout
      title='Modificar Producto'>
      <ConsultarProducto
        id={id}
        component={(producto) => (
          <ModificarProducto
            producto={producto}
          />
        )}
      />
    </BackButtonLayout>
  )
}
