"use client"

import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { CheckCircle2, Clock, Truck } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConfirmButton } from "../shared/confirm-botton"
import { useToast } from "@/hooks/use-toast"
import type { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity"
import { DetallePedidoService } from "@/services/detalle-pedido/detalle-pedido.service"
import RefreshPage from "@/actions/refresh-page"
import ProductCard from "./product-card"

type ProductsListProps = {
  detallesPedido: DetallePedidoEntity[]
}

export function ProductsList({ detallesPedido }: ProductsListProps) {
  const { toast } = useToast()
  const token = useSession().data?.user.token
  const pathname = usePathname()

  const marcarComoEntregado = async (detallePedidoId: string) => {
    const response = await new DetallePedidoService(token).actualizar({
      id: detallePedidoId,
      estado: "ENTREGADO",
    })
    
    if (!response.data) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error?.message || "Error al actualizar el producto.",
      })
      return
    }
    
    toast({
      title: "Éxito",
      description: "Producto actualizado correctamente.",
    })
    await RefreshPage(pathname)
  }

  const footer = (detalle: DetallePedidoEntity) => {
    if (detalle.estado !== "PARCIAL") {
      return null
    } 
    return (<div className="flex flex-1 justify-end">
      <ConfirmButton size={"sm"}

        title="Marcar como entregado"
        description="¿Está seguro de marcarlo como entregado?, esto marcara de manera definitiva la operación de entrega del producto." onClick={() => marcarComoEntregado(detalle.id)}>
        Finalizar entrega
      </ConfirmButton>
    </div>
  )
}

  return (
    <div className="space-y-3">
      <Tabs defaultValue="all">
        {/* Tabs responsivos */}
        <div className="overflow-x-auto pb-1 -mx-1 px-1">
          <TabsList className="inline-flex w-auto min-w-full sm:w-full mb-3 h-auto">
            <TabsTrigger 
              value="all" 
              className="h-8 px-2 py-1 text-xs sm:text-sm flex-1 sm:flex-none"
            >
              Todos
            </TabsTrigger>
            <TabsTrigger 
              value="pending" 
              className="h-8 px-2 py-1 text-xs sm:text-sm flex-1 sm:flex-none flex items-center gap-1"
            >
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" /> 
              <span className="whitespace-nowrap">Pendientes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="inTransit" 
              className="h-8 px-2 py-1 text-xs sm:text-sm flex-1 sm:flex-none flex items-center gap-1"
            >
              <Truck className="h-3 w-3 sm:h-4 sm:w-4" /> 
              <span className="whitespace-nowrap">En Tránsito</span>
            </TabsTrigger>
            <TabsTrigger 
              value="partial" 
              className="h-8 px-2 py-1 text-xs sm:text-sm flex-1 sm:flex-none flex items-center gap-1"
            >
              <Truck className="h-3 w-3 sm:h-4 sm:w-4" /> 
              <span className="whitespace-nowrap">Parciales</span>
            </TabsTrigger>
            <TabsTrigger 
              value="delivered" 
              className="h-8 px-2 py-1 text-xs sm:text-sm flex-1 sm:flex-none flex items-center gap-1"
            >
              <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" /> 
              <span className="whitespace-nowrap">Entregados</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Contenido de los tabs */}
        <TabsContent value="all" className="space-y-3 mt-0">
          {detallesPedido.length > 0 ? (
            detallesPedido.map((detalle) => (
              <ProductCard key={detalle.id} detalle={detalle} footer={footer} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No hay productos disponibles</p>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-3 mt-0">
          {detallesPedido.filter((d) => d.estado === "PENDIENTE").length > 0 ? (
            detallesPedido
              .filter((d) => d.estado === "PENDIENTE")
              .map((detalle) => (
                <ProductCard key={detalle.id} detalle={detalle} footer={footer} />
              ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No hay productos pendientes</p>
          )}
        </TabsContent>

        <TabsContent value="inTransit" className="space-y-3 mt-0">
          {detallesPedido.filter((d) => d.estado === "EN_TRANSITO").length > 0 ? (
            detallesPedido
              .filter((d) => d.estado === "EN_TRANSITO")
              .map((detalle) => (
                <ProductCard key={detalle.id} detalle={detalle} footer={footer} />
              ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No hay productos en tránsito</p>
          )}
        </TabsContent>

        <TabsContent value="partial" className="space-y-3 mt-0">
          {detallesPedido.filter((d) => d.estado === "PARCIAL").length > 0 ? (
            detallesPedido
              .filter((d) => d.estado === "PARCIAL")
              .map((detalle) => (
                <ProductCard key={detalle.id} detalle={detalle} footer={footer} />
              ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No hay productos parciales</p>
          )}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-3 mt-0">
          {detallesPedido.filter((d) => d.estado === "ENTREGADO").length > 0 ? (
            detallesPedido
              .filter((d) => d.estado === "ENTREGADO")
              .map((detalle) => (
                <ProductCard key={detalle.id} detalle={detalle} />
              ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No hay productos entregados</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
