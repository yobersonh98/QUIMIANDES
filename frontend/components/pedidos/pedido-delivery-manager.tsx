"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { AlertCircle, Plus } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "../ui/button"
import { ConfirmButton } from "../shared/confirm-botton"
import { useToast } from "@/hooks/use-toast"
import type { PedidoEntity } from "@/services/pedidos/entity/pedido.entity"
import { PedidoService } from "@/services/pedidos/pedido.service"
import RefreshPage from "@/actions/refresh-page"

import PedidoInfoBasica from "./peido-info-basica"
import { ProductsList } from "./products-list"
import { DeliveryHistory } from "./delivery-history"
import { cn, getBaseColorByEstado, getBgColorByEstado } from "@/lib/utils"

type OrderDeliveryManagerProps = {
  pedido: PedidoEntity
}

function getDeliveryStats(detalles: PedidoEntity["detallesPedido"] = []) {
  return {
    total: detalles.length,
    delivered: detalles.filter((p) => p.estado === "ENTREGADO").length,
    partial: detalles.filter((p) => p.estado === "PARCIAL").length,
    pending: detalles.filter((p) => p.estado === "PENDIENTE").length,
    inTransit: detalles.filter((p) => p.estado === "EN_TRANSITO").length,
  }
}

type DeliveryStatCardProps = {
  label: string
  value: number
  className?: string
  textColor?: string
}

const DeliveryStatCard = ({ label, value, className = "", textColor = "" }: DeliveryStatCardProps) => (
  <div className={`rounded-md p-2 ${className}`}>
    <div className="flex flex-col items-center justify-center text-center">
      <div className={`text-xl font-bold ${textColor}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  </div>
)

export function OrderDeliveryManager({ pedido }: OrderDeliveryManagerProps) {
  const deliveryStats = getDeliveryStats(pedido.detallesPedido)
  const token = useSession().data?.user?.token
  const pathName = usePathname()
  const { toast } = useToast()

  const handleFinalizarPedido = async () => {
    const response = await new PedidoService(token).finalizarEntregaPedido(pedido.id)
    if (response.error) {
      toast({
        title: "Error",
        description: response.error.message,
        variant: "destructive",
      })
      return
    }
    if (response.data) {
      toast({
        title: "Éxito",
        description: "Pedido finalizado correctamente.",
        variant: "default",
      })
      await RefreshPage(pathName)
    } else {
      toast({
        title: "Error",
        description: "No se pudo finalizar el pedido.",
        variant: "destructive",
      })
      return
    }
  }

  const handleCancelarPedido = async () => {
    const response = await new PedidoService(token).cancelarPedido(pedido.id)
    if (response.error) {
      toast({
        title: "Error",
        description: response.error.message,
        variant: "destructive",
      })
      return
    }
    if (response.data) {
      toast({
        title: "Éxito",
        description: "Pedido cancelado correctamente.",
        variant: "default",
      })
      await RefreshPage(pathName)
    } else {
      toast({
        title: "Error",
        description: "No se pudo cancelar el pedido.",
        variant: "destructive",
      })
      return
    }
  }

  const noPuedeModificar = pedido.estado == "CANCELADO" || pedido.estado == "ENTREGADO"

  return (
    <div className="space-y-4">
      {/* Información básica del pedido */}
        <PedidoInfoBasica pedido={pedido} />

      <Card className="overflow-hidden">
        <CardHeader className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="text-lg">Estado de Entrega</CardTitle>

          {/* Botones de acción */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {!noPuedeModificar && (
              <Link href={`/dashboard/pedidos/${pedido?.id}/gestionar/registrar-entrega`} className="w-full sm:w-auto">
                <Button size="sm" className="w-full sm:w-auto">
                  <Plus size={16} className="mr-1" />
                  <span className="whitespace-nowrap">Programar Entrega</span>
                </Button>
              </Link>
            )}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <ConfirmButton
                size="sm"
                className="flex-1 sm:flex-none text-xs"
                title="¿Finalizar pedido?"
                description="Esta acción marcará el pedido como entregado y no podrá ser revertida."
                onClick={handleFinalizarPedido}
                variant="secondary"
                disabled={noPuedeModificar}
              >
                Finalizar Entrega
              </ConfirmButton>
              <ConfirmButton
                size="sm"
                className="flex-1 sm:flex-none text-xs"
                title="¿Cancelar pedido?"
                description="Esta acción cancelará el pedido y no podrá ser revertida."
                onClick={handleCancelarPedido}
                disabled={noPuedeModificar}
                variant="destructive"
              >
                Cancelar Pedido
              </ConfirmButton>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-4">
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <DeliveryStatCard label="Total Productos" value={deliveryStats.total} className="bg-muted" />
            <DeliveryStatCard
              label="Entregados"
              value={deliveryStats.delivered}
              className={cn(getBgColorByEstado('ENTREGADO', 50))}
              textColor={`text-${getBaseColorByEstado('ENTREGADO')}-600`}
            />
            <DeliveryStatCard
              label="Parciales"
              value={deliveryStats.partial}
              className={cn(getBgColorByEstado('PARCIAL', 50))}
              textColor={`text-${getBaseColorByEstado('PARCIAL')}-600 `}
            />
            <DeliveryStatCard
              label="Pendientes"
              value={deliveryStats.pending}
              className={cn(getBgColorByEstado('PENDIENTE', 50))}
              textColor={`text-${getBaseColorByEstado('PENDIENTE')}-600`}
            />
          </div>

          {/* Alerta informativa */}
          <Alert className="mb-3 py-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-sm">Información</AlertTitle>
            <AlertDescription className="text-xs">
              El estado general del pedido se actualiza automáticamente según las entregas registradas.
            </AlertDescription>
          </Alert>

          {/* Pestañas de productos y entregas */}
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid grid-cols-2 mb-3 h-9">
              <TabsTrigger value="products" className="text-sm">
                Productos
              </TabsTrigger>
              <TabsTrigger value="deliveries" className="text-sm">
                Gestionar Entregas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-0">
              <ProductsList detallesPedido={pedido.detallesPedido || []} />
            </TabsContent>
            <TabsContent value="deliveries" className="mt-0">
              <DeliveryHistory pedido={pedido} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
