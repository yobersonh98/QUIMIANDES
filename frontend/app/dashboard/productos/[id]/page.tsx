import ConsultarProducto from '@/components/productos/consultar-producto';
import ProductoInfo from '@/components/productos/producto-info';
import BackButtonLayout from '@/components/shared/back-button-layout';
import { PageProps, PaginationSearchParamsPage } from '@/types/pagination';
import React from 'react'


export default async function page(props: PageProps<PaginationSearchParamsPage>) {
  const params = await props.params

  return (
    <BackButtonLayout
      title='Detalles del Producto'
    >
      <ConsultarProducto
        id={params?.id}
        component={(producto) => {
          return (
            <ProductoInfo
              producto={producto}
            />
          )
        }
        }
      />
    </BackButtonLayout>
  )
}
