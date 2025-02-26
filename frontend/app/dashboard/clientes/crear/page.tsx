import { ClientForm } from '@/components/clientes/client-form'
import BackButtonLayout from '@/components/shared/back-button-layout'
import React from 'react'

export default function CrearCliente() {
  return (
    <BackButtonLayout title="Crear cliente">
      <ClientForm/>
    </BackButtonLayout>
  )
}
