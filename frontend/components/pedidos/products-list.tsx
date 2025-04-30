"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Clock, Truck } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity"
import { useSession } from "next-auth/react"
import { ConfirmButton } from "../shared/confirm-botton"
import { DetallePedidoService } from "@/services/detalle-pedido/detalle-pedido.service"
import { useToast } from "@/hooks/use-toast"
import { usePathname } from "next/navigation"
import RefreshPage from "@/actions/refresh-page"

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
  const header =
    (detalle: DetallePedidoEntity) => (
      <div
        className="flex justify-end"
      >
        <ConfirmButton
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
            <ProductCard key={detalle.id} detalle={detalle} header={header} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {detallesPedido
            .filter((d) => d.estado === "PENDIENTE")
            .map((detalle) => (
              <ProductCard key={detalle.id} detalle={detalle} header={header} />
            ))}
        </TabsContent>

        <TabsContent value="inTransit" className="space-y-4">
          {detallesPedido
            .filter((d) => d.estado === "EN_TRANSITO")
            .map((detalle) => (
              <ProductCard key={detalle.id} detalle={detalle} header={header} />
            ))}
        </TabsContent>

        <TabsContent value="partial" className="space-y-4">
          {detallesPedido
            .filter((d) => d.estado === "PARCIAL")
            .map((detalle) => (
              <ProductCard key={detalle.id} detalle={detalle} header={header} />
            ))}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          {detallesPedido
            .filter((d) => d.estado === "ENTREGADO")
            .map((detalle) => (
              <ProductCard key={detalle.id} detalle={detalle}
                header={header}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
function ProductCard({ detalle, header }: { detalle: DetallePedidoEntity, header?: (detallePedido: DetallePedidoEntity) => React.ReactNode }) {
  const estadoDetallePedido = detalle.estado;
  const porcentaje = Math.min(Math.round((detalle.cantidadEntregada / detalle.cantidad) * 100), 100)
  const getIconoEstado = () => {
    switch (estadoDetallePedido) {
      case "ENTREGADO":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "PARCIAL":
        return <Truck className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  const getBadgeEstado = () => {
    let variant: "default" | "secondary" | "outline" = "outline"
    if (estadoDetallePedido === "ENTREGADO") variant = "default"
    else if (estadoDetallePedido === estadoDetallePedido) variant = "secondary"

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {getIconoEstado()}
        {estadoDetallePedido}
      </Badge>
    )
  }

  return (
    <Card
      className={cn(
        "border-l-4",
        estadoDetallePedido === "ENTREGADO"
          ? "border-l-green-500"
          : estadoDetallePedido === "PARCIAL"
            ? "border-l-yellow-500"
            : "border-l-blue-500",
      )}
    >
      {header && (
        <CardHeader>
          {header(detalle)}
        </CardHeader>
      )}
      <CardContent className="p-4">
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                {detalle.producto.nombre}
                <span className="text-sm font-normal text-muted-foreground">({detalle.id})</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Requerido para: {detalle.fechaEntrega ? new Date(detalle.fechaEntrega).toLocaleDateString() : "No especificada"}
              </p>
            </div>
            <div>{getBadgeEstado()}</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Cantidad Solicitada</div>
              <div>{detalle.cantidad.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Cantidad Despachada</div>
              <div>{(detalle.cantidadDespachada || 0).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Cantidad Entregada</div>
              <div>{(detalle.cantidadEntregada || 0).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Tipo de Entrega</div>
              <div>{detalle.tipoEntrega || "No especificado"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Lugar de Entrega</div>
              <div>
                {detalle.lugarEntrega?.nombre || "No especificado"}, {detalle.lugarEntrega?.ciudad?.nombre || "No especificada"}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progreso de entrega</span>
              <span>{porcentaje}%</span>
            </div>
            <Progress value={porcentaje} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
