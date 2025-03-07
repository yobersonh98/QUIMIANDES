"use client"
import React from 'react'
import { ProductForm } from './producto-form'
import { useSession } from 'next-auth/react'
import { ProductoService } from '@/services/productos/productos.service'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { ProductoEntity } from '@/services/productos/entities/producto.entity'
import { ActualizarProductoModel } from '@/services/productos/models/actualizar-producto.model'
import RefreshPage from '@/actions/refresh-page'


type Props = {
  producto:ProductoEntity
}
export default function ModificarProducto( {producto}: Props) {
  const session = useSession()
  const {toast} = useToast()
  const router = useRouter()
  const hanldeSubmit = async (values: ActualizarProductoModel) => {
    try {
      const {error} = await new ProductoService(session.data?.user.token).modificar(values)
      if (error) {
        return toast({
          title: 'Error',
          description: error?.message || 'Ocurrio un error',
          variant: "destructive"
        })
      }
      await RefreshPage("/dashboard/productos")
      toast({
        title: 'Producto creado',
        description: 'El producto se ha modificado correctamente',
        variant:"default"
      })
      router.back()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <ProductForm 
      onSubmit={(data) => hanldeSubmit(data as ActualizarProductoModel)}
      initialData={producto}
      isEditing
    />
  )
}
