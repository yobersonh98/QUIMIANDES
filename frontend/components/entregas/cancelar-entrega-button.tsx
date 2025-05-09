import React from 'react'
import { ConfirmButton } from '../shared/confirm-botton'
import { useToast } from '@/hooks/use-toast'
import { cancelarEntregaAction } from '@/services/entrega-pedido/actions/cancelar-entrega-action'
import RefreshPage from '@/actions/refresh-page'
import { usePathname } from 'next/navigation'

interface CancelarEntregaButtonProps {
  entregaId: string
  title?: string
  description?: string
  children?: React.ReactNode // Texto visible en el botón
  size?: "sm" | "default" | "lg" | "icon" | null | undefined
}

export default function CancelarEntregaButton({
  entregaId,
  title = 'Cancelar entrega',
  description = '¿Está seguro de que desea cancelar la entrega?',
  children = 'Cancelar',
  size= "sm"
}: CancelarEntregaButtonProps) {
  const { toast } = useToast()
  const pathName = usePathname()
  const handleClick = async () => {
    const actionResponse = await cancelarEntregaAction(entregaId)
    toast({
      variant: actionResponse.error ? 'destructive': 'default',
      description: actionResponse.message
    })
    await RefreshPage(pathName)
  }

  return (
    <ConfirmButton
      onClick={handleClick}
      title={title}
      variant={'destructive'}
      description={description}
      size={size}
    >
      {children}
    </ConfirmButton>
  )
}
