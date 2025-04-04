"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Plus} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PedidoEntity } from "@/services/pedidos/entity/pedido.entity"
import PedidoInfoBasica from "./peido-info-basica"
import { ProductsList } from "./products-list"
import Link from "next/link"
import { Button } from "../ui/button"

type DeliveryLocation = {
  id: string
  name: string
  city: string
}

type Product = {
  id: string
  name: string
  requirementDate: string
  presentation: string
  unit: number
  quantity: number
  dispatchedQuantity: number
  total: number
  receivedWeight: number
  deliveryType: string
  deliveryLocation: DeliveryLocation
  deliveryStatus: string
}

type DeliveryProduct = {
  productId: string
  quantity: number
  observations?: string
}

type Delivery = {
  id: string
  date: string
  vehicleInternal?: string
  vehicleExternal?: string
  deliveredBy?: string
  deliveryLocationId: string
  deliveryLocationName: string
  deliveryType: string
  remission?: string
  observations?: string
  products: DeliveryProduct[]
}

type OrderData = {
  id: string
  orderDate: string
  client: {
    id: string
    name: string
    document: string
  }
  requirementDate: string
  status: string
  purchaseOrder: string
  totalWeight: number
  totalValue: number
  products: Product[]
  deliveries: Delivery[]
  observations: string
}

type OrderDeliveryManagerProps = {
  initialData: OrderData
  pedido: PedidoEntity
}



export function OrderDeliveryManager({ initialData, pedido }: OrderDeliveryManagerProps) {
  const [orderData, setOrderData] = useState<OrderData>(initialData)


  // Obtener estadísticas de entrega
  const deliveryStats = {
    total: pedido.detallesPedido?.length,
    delivered: pedido.detallesPedido.filter((p) => p.cantidadDespachada >= p.cantidad).length,
    partial: pedido.detallesPedido.filter((p) => p.cantidadDespachada > 0 && p.cantidadDespachada < p.cantidad).length,
    pending: pedido.detallesPedido.filter((p) => p.cantidadDespachada === 0).length,
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
              {/* <DeliveryHistory orderId={orderId} deliveries={orderData.deliveries} products={orderData.products} /> */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}