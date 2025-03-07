import ListaProductos from '@/components/productos/lista-productos'
import { Button } from '@/components/ui/button'
import { PageProps, PaginationSearchParamsPage } from '@/types/pagination'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default async function Productos(props: PageProps<PaginationSearchParamsPage>) {
  const searchParams = await props.searchParams
  console.log('searchParams', searchParams)
  return (
    <div>
      <div className="flex justify-between my-4 font-bold">
        <h1
          className="text-3xl"
        >Productos</h1>
        <Link href="/dashboard/productos/crear" passHref>
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Crear Producto
          </Button>
        </Link>
      </div>
      <ListaProductos
        pagination={searchParams}
      />
    </div>
  )
}
