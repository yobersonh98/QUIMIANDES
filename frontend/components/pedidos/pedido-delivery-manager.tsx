"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Plus} from "lucide-react"
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



export function OrderDeliveryManager({ pedido }: OrderDeliveryManagerProps) {

  // Obtener estadísticas de entrega
  const deliveryStats = {
    total: pedido.detallesPedido?.length,
    delivered: pedido.detallesPedido.filter((p) => p.estado === 'ENTREGADO').length,
    partial: pedido.detallesPedido.filter((p) => p.estado === 'PARCIAL').length,
    pending: pedido.detallesPedido.filter((p) => p.estado === 'PENDIENTE').length,
    inTransit: pedido.detallesPedido.filter((p) => p.estado === 'EN_TRANSITO').length,
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <PedidoInfoBasica
          pedido={pedido}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Estado de Entrega</CardTitle>
          <Link href={`/dashboard/pedidos/${pedido?.id}/gestionar/registrar-entrega`}>
          <Button>
            <Plus size={24} />
            Registrar Entrega
          </Button>
        </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="bg-muted">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="text-2xl font-bold">{deliveryStats.total}</div>
                <div className="text-sm text-muted-foreground">Total Productos</div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{deliveryStats.delivered}</div>
                <div className="text-sm text-muted-foreground">Entregados</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{deliveryStats.partial}</div>
                <div className="text-sm text-muted-foreground">Parciales</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-900/20">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{deliveryStats.pending}</div>
                <div className="text-sm text-muted-foreground">Pendientes</div>
              </CardContent>
            </Card>
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