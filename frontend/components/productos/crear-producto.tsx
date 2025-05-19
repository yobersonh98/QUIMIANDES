"use client"
import React from 'react'
import { ProductForm } from './producto-form'
import { useSession } from 'next-auth/react'
import { CrearProductoModel } from '@/services/productos/models/crear-producto.model'
import { ProductoService } from '@/services/productos/productos.service'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import RefreshPage from '@/actions/refresh-page'

export default function CrearProducto() {
  const session = useSession()
  const {toast} = useToast()
  const router = useRouter()
  const hanldeSubmit = async (values: CrearProductoModel) => {
    try {
      const {error} = await new ProductoService(session.data?.user.token).crear(values)
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
        description: 'El producto se ha creado correctamente',
        variant:"default"
      })
      router.back()
    } catch (error) {
      console.error("Error al crear producto:", error)
      toast({
        title: 'Error',
        description: 'Ocurrio un error al crear el producto',
        variant: "destructive"
      })
    }
  }
  return (
    <ProductForm 
      isEditing={false}
      onSubmit={(data) => hanldeSubmit(data as CrearProductoModel)}
      
    />
  )
}
