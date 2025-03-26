"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductDeliveryForm } from "./product-delivery-form"
import { AlertCircle, CheckCircle2, Clock, Truck } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
  deliveryLocation: string
  city: string
  deliveryStatus: string
  deliveryDate: string
  deliveryNotes: string
}

type OrderData = {
  id: string
  orderDate: string
  client: {
    name: string
    document: string
  }
  requirementDate: string
  status: string
  purchaseOrder: string
  totalWeight: number
  totalValue: number
  products: Product[]
  observations: string
}

type OrderDeliveryManagerProps = {
  orderId: string
  initialData: OrderData
}

export function OrderDeliveryManager({ orderId, initialData }: OrderDeliveryManagerProps) {
  const [orderData, setOrderData] = useState<OrderData>(initialData)

  // Función para actualizar el estado de un producto
  const updateProductDelivery = (productId: string, updatedProduct: Partial<Product>) => {
    const updatedProducts = orderData.products.map((product) => {
      if (product.id === productId) {
        return { ...product, ...updatedProduct }
      }
      return product
    })

    // Calcular el nuevo estado general del pedido basado en los estados de los productos
    const allDelivered = updatedProducts.every((product) => product.deliveryStatus === "Entregado")
    const anyPending = updatedProducts.some((product) => product.deliveryStatus === "Pendiente")
    const anyPartial = updatedProducts.some((product) => product.deliveryStatus === "Entregado Parcialmente")

    let newStatus = "En entrega"
    if (allDelivered) {
      newStatus = "Entregado"
    } else if (anyPartial || (!anyPending && !allDelivered)) {
      newStatus = "Entregado Parcialmente"
    }

    setOrderData({
      ...orderData,
      products: updatedProducts,
      status: newStatus,
    })
  }

  // Función para guardar todos los cambios
  const saveChanges = () => {
    // Aquí iría la lógica para guardar los cambios en la base de datos
    console.log("Guardando cambios:", orderData)
    alert("Cambios guardados correctamente")
  }

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
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Cliente</div>
                <div>{orderData.client.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Documento</div>
                <div>{orderData.client.document}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información del Pedido</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Fecha del Pedido</div>
                <div>{orderData.orderDate}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Estado</div>
                <div>
                  <Badge
                    variant={
                      orderData.status === "Entregado"
                        ? "default"
                        : orderData.status === "Entregado Parcialmente"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {orderData.status}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Orden de Compra</div>
                <div>{orderData.purchaseOrder}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Fecha de Requerimiento</div>
                <div>{orderData.requirementDate}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estado de Entrega</CardTitle>
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
              El estado general del pedido se actualiza automáticamente según el estado de entrega de cada producto.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Pendientes
              </TabsTrigger>
              <TabsTrigger value="partial" className="flex items-center gap-2">
                <Truck className="h-4 w-4" /> Parciales
              </TabsTrigger>
              <TabsTrigger value="delivered" className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Entregados
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {orderData.products.map((product) => (
                <ProductDeliveryForm
                  key={product.id}
                  product={product}
                  onUpdate={(updatedProduct) => updateProductDelivery(product.id, updatedProduct)}
                />
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {orderData.products
                .filter((product) => product.deliveryStatus === "Pendiente")
                .map((product) => (
                  <ProductDeliveryForm
                    key={product.id}
                    product={product}
                    onUpdate={(updatedProduct) => updateProductDelivery(product.id, updatedProduct)}
                  />
                ))}
            </TabsContent>

            <TabsContent value="partial" className="space-y-4">
              {orderData.products
                .filter((product) => product.deliveryStatus === "Entregado Parcialmente")
                .map((product) => (
                  <ProductDeliveryForm
                    key={product.id}
                    product={product}
                    onUpdate={(updatedProduct) => updateProductDelivery(product.id, updatedProduct)}
                  />
                ))}
            </TabsContent>

            <TabsContent value="delivered" className="space-y-4">
              {orderData.products
                .filter((product) => product.deliveryStatus === "Entregado")
                .map((product) => (
                  <ProductDeliveryForm
                    key={product.id}
                    product={product}
                    onUpdate={(updatedProduct) => updateProductDelivery(product.id, updatedProduct)}
                  />
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={saveChanges}>
          Guardar Cambios
        </Button>
      </div>
    </div>
  )
}

