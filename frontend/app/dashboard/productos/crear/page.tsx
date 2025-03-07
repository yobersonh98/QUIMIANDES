import CrearProducto from '@/components/productos/crear-producto'
import BackButtonLayout from '@/components/shared/back-button-layout'
import React from 'react'

export default function page() {
  return (
    <BackButtonLayout
      title='Crear Producto'
    >
      <CrearProducto />
    </BackButtonLayout>
  )
}
