"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PedidoEntity } from "@/services/pedidos/entity/pedido.entity"
import PedidoInfoBasica from "./peido-info-basica"
import { ProductsList } from "./products-list"
import Link from "next/link"
import { Button } from "../ui/button"
import { DeliveryHistory } from "./delivery-history"

type OrderDeliveryManagerProps = {
  pedido: PedidoEntity
}

function getDeliveryStats(detalles: PedidoEntity["detallesPedido"] = []) {
  return {
    total: detalles.length,
    delivered: detalles.filter((p) => p.estado === 'ENTREGADO').length,
    partial: detalles.filter((p) => p.estado === 'PARCIAL').length,
    pending: detalles.filter((p) => p.estado === 'PENDIENTE').length,
    inTransit: detalles.filter((p) => p.estado === 'EN_TRANSITO').length,
  }
}

type DeliveryStatCardProps = {
  label: string
  value: number
  className?: string
  textColor?: string
}

const DeliveryStatCard = ({ label, value, className = "", textColor = "" }: DeliveryStatCardProps) => (
  <Card className={className}>
    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
      <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </CardContent>
  </Card>
)

export function OrderDeliveryManager({ pedido }: OrderDeliveryManagerProps) {
  const deliveryStats = getDeliveryStats(pedido.detallesPedido)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 my-6">
        <PedidoInfoBasica pedido={pedido} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Estado de Entrega</CardTitle>
          {pedido.estado !== 'ENTREGADO' && (
            <Link href={`/dashboard/pedidos/${pedido?.id}/gestionar/registrar-entrega`}>
              <Button>
                <Plus size={24} />
                Registrar Entrega
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <DeliveryStatCard label="Total Productos" value={deliveryStats.total} className="bg-muted" />
            <DeliveryStatCard label="Entregados" value={deliveryStats.delivered} className="bg-green-50 dark:bg-green-900/20" textColor="text-green-600 dark:text-green-400" />
            <DeliveryStatCard label="Parciales" value={deliveryStats.partial} className="bg-yellow-50 dark:bg-yellow-900/20" textColor="text-yellow-600 dark:text-yellow-400" />
            <DeliveryStatCard label="Pendientes" value={deliveryStats.pending} className="bg-blue-50 dark:bg-blue-900/20" textColor="text-blue-600 dark:text-blue-400" />
          </div>

          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Información</AlertTitle>
            <AlertDescription>
              El estado general del pedido se actualiza automáticamente según las entregas registradas.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="deliveries">Historial de Entregas</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <ProductsList detallesPedido={pedido.detallesPedido || []} />
            </TabsContent>
            <TabsContent value="deliveries">
              <DeliveryHistory pedido={pedido} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
