"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Clock, Truck } from "lucide-react"
import { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity"
import { useSession } from "next-auth/react"
import { ConfirmButton } from "../shared/confirm-botton"
import { DetallePedidoService } from "@/services/detalle-pedido/detalle-pedido.service"
import { useToast } from "@/hooks/use-toast"
import { usePathname } from "next/navigation"
import RefreshPage from "@/actions/refresh-page"
import ProductCard from "./product-card"

type ProductsListProps = {
  detallesPedido: DetallePedidoEntity[]
}


export function ProductsList({ detallesPedido }: ProductsListProps) {
  const { toast } = useToast();
  const token = useSession().data?.user.token;
  const pathname = usePathname();
  const marcarComoEntregado = async (detallePedidoId: string) => {
    const response = await new DetallePedidoService(token).actualizar({
      id: detallePedidoId,
      estado: 'ENTREGADO'
    })
    if (!response.data) {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error?.message || "Error al actulizar el producto."
      })
      return;
    }
    toast({
      title: "Éxito",
      description: "Producto actulizado correctamente."
    })
    await RefreshPage(pathname)

  }
  const footer =
    (detalle: DetallePedidoEntity) => (
      <div
        className="flex flex-1 justify-end"
      >
        <ConfirmButton
          title="Marcar como entregado"
          onClick={() => marcarComoEntregado(detalle.id)}
        >
          Entregar
        </ConfirmButton>
      </div>
    )
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Pendientes
          </TabsTrigger>
          <TabsTrigger value='inTransit' className="flex items-center gap-2">
            <Truck className="h-4 w-4" /> En Tránsito
          </TabsTrigger>
          <TabsTrigger value="partial" className="flex items-center gap-2">
            <Truck className="h-4 w-4" /> Parciales
          </TabsTrigger>
          <TabsTrigger value="delivered" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Entregados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {detallesPedido.map((detalle) => (
            <ProductCard key={detalle.id} detalle={detalle} footer={footer} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {detallesPedido
            .filter((d) => d.estado === "PENDIENTE")
            .map((detalle) => (
              <ProductCard key={detalle.id} detalle={detalle} footer={footer} />
            ))}
        </TabsContent>

        <TabsContent value="inTransit" className="space-y-4">
          {detallesPedido
            .filter((d) => d.estado === "EN_TRANSITO")
            .map((detalle) => (
              <ProductCard key={detalle.id} detalle={detalle} footer={footer} />
            ))}
        </TabsContent>

        <TabsContent value="partial" className="space-y-4">
          {detallesPedido
            .filter((d) => d.estado === "PARCIAL")
            .map((detalle) => (
              <ProductCard key={detalle.id} detalle={detalle} footer={footer} />
            ))}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          {detallesPedido
            .filter((d) => d.estado === "ENTREGADO")
            .map((detalle) => (
              <ProductCard key={detalle.id} detalle={detalle}
                footer={footer}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
