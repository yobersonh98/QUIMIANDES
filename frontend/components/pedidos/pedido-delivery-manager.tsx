"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PedidoEntity } from "@/services/pedidos/entity/pedido.entity"
import PedidoInfoBasica from "./peido-info-basica"
import { ProductsList } from "./products-list"
import { DeliveryHistory } from "./delivery-history"

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
  orderId: string
  initialData: OrderData
  pedido: PedidoEntity
}



export function OrderDeliveryManager({ initialData, pedido, orderId }: OrderDeliveryManagerProps) {
  const [orderData, setOrderData] = useState<OrderData>(initialData)

  // Calcular el estado de entrega de cada producto basado en las entregas
  useEffect(() => {
    const updatedProducts = orderData.products.map((product) => {
      // Calcular la cantidad total despachada para este producto
      const totalDispatched = orderData.deliveries.reduce((sum, delivery) => {
        const productDelivery = delivery.products.find((p) => p.productId === product.id)
        return sum + (productDelivery?.quantity || 0)
      }, 0)

      // Actualizar la cantidad despachada
      const updatedProduct = {
        ...product,
        dispatchedQuantity: totalDispatched,
      }

      // Determinar el estado de entrega
      if (totalDispatched === 0) {
        updatedProduct.deliveryStatus = "Pendiente"
      } else if (totalDispatched >= product.quantity) {
        updatedProduct.deliveryStatus = "Entregado"
      } else {
        updatedProduct.deliveryStatus = "Entregado Parcialmente"
      }

      return updatedProduct
    })

    // Calcular el estado general del pedido
    const allDelivered = updatedProducts.every((p) => p.deliveryStatus === "Entregado")
    const anyPending = updatedProducts.some((p) => p.deliveryStatus === "Pendiente")
    const anyPartial = updatedProducts.some((p) => p.deliveryStatus === "Entregado Parcialmente")

    let newStatus = "En entrega"
    if (allDelivered) {
      newStatus = "Entregado"
    } else if (anyPartial || (!anyPending && !allDelivered)) {
      newStatus = "Entregado Parcialmente"
    }

    setOrderData((prev) => ({
      ...prev,
      products: updatedProducts,
      status: newStatus,
    }))
  }, [orderData.deliveries])

  // Obtener estadísticas de entrega
  const deliveryStats = {
    total: orderData.products.length,
    delivered: orderData.products.filter((p) => p.deliveryStatus === "Entregado").length,
    partial: orderData.products.filter((p) => p.deliveryStatus === "Entregado Parcialmente").length,
    pending: orderData.products.filter((p) => p.deliveryStatus === "Pendiente").length,
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
          {/* <Button asChild>
            <Link href={`/dashboard/pedidos/${orderId}/crear-entrega`}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Entrega
            </Link>
          </Button> */}
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
              <ProductsList products={orderData.products} />
            </TabsContent>

            <TabsContent value="deliveries">
              <DeliveryHistory orderId={orderId} deliveries={orderData.deliveries} products={orderData.products} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}