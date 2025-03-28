"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Eye, FileText, Truck } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

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
  deliveryLocation: {
    id: string
    name: string
    city: string
  }
  deliveryStatus: string
}

type DeliveryHistoryProps = {
  orderId: string
  deliveries: Delivery[]
  products: Product[]
}

// Datos de ejemplo para el historial de entregas
const exampleDeliveries: Delivery[] = [
  {
    id: "delivery-1",
    date: "25-dic-2023",
    vehicleInternal: "Camión #123",
    deliveredBy: "Juan Pérez",
    deliveryLocationId: "loc-001",
    deliveryLocationName: "Planta Porfice, Cúcuta",
    deliveryType: "Entrega al Cliente",
    remission: "REM-001",
    observations: "Entrega realizada sin novedad",
    products: [
      {
        productId: "PC-001.1",
        quantity: 20000,
        observations: "Producto entregado en buenas condiciones",
      },
      {
        productId: "PC-001.5",
        quantity: 3000,
        observations: "Entrega parcial según acuerdo con el cliente",
      },
    ],
  },
  {
    id: "delivery-2",
    date: "28-dic-2023",
    vehicleExternal: "Placa ABC-123",
    deliveredBy: "Carlos Rodríguez",
    deliveryLocationId: "loc-002",
    deliveryLocationName: "Planta Quimandes, Cúcuta",
    deliveryType: "Recoge en Planta",
    remission: "REM-002",
    products: [
      {
        productId: "PC-001.2",
        quantity: 15,
        observations: "",
      },
    ],
  },
  {
    id: "delivery-3",
    date: "02-ene-2024",
    vehicleInternal: "Camión #456",
    deliveredBy: "María López",
    deliveryLocationId: "loc-003",
    deliveryLocationName: "Planta Tonchala, Tonchala",
    deliveryType: "Entrega al Cliente",
    remission: "REM-003",
    observations: "Cliente solicitó entrega urgente",
    products: [
      {
        productId: "PC-001.3",
        quantity: 5,
        observations: "Entrega completa",
      },
      {
        productId: "PC-001.4",
        quantity: 5000,
        observations: "Entrega completa según orden de compra",
      },
    ],
  },
]

export function DeliveryHistory({ orderId, deliveries, products }: DeliveryHistoryProps) {
  // Usar los datos de ejemplo si no hay entregas reales
  const displayDeliveries = deliveries.length > 0 ? deliveries : exampleDeliveries

  if (displayDeliveries.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No hay entregas registradas</h3>
          <p className="text-muted-foreground">
            Utilice el botón Registrar Entrega para comenzar a registrar entregas para este pedido.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {displayDeliveries.map((delivery, index) => (
        <DeliveryCard key={delivery.id} delivery={delivery} products={products} index={index} orderId={orderId} />
      ))}
    </div>
  )
}

function DeliveryCard({
  delivery,
  products,
  index,
  orderId,
}: {
  delivery: Delivery
  products: Product[]
  index: number
  orderId: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  // Función para obtener el nombre del producto a partir de su ID
  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product ? product.name : "Producto desconocido"
  }

  // Calcular el total de productos entregados
  const totalProductsDelivered = delivery.products.length

  // Calcular la cantidad total entregada
  const totalQuantityDelivered = delivery.products.reduce((sum, product) => sum + product.quantity, 0)

  return (
    <Card className="overflow-hidden">
      <div className="bg-muted/50 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-medium">
            {index + 1}
          </div>
          <div>
            <h3 className="font-medium">Entrega {index + 1}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{delivery.date}</span>
              <span>•</span>
              <span>{delivery.deliveryLocationName}</span>
              <span>•</span>
              <Badge variant="outline" className="text-xs">
                {delivery.remission || "Sin remisión"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Link href={`/dashboard/pedidos/${orderId}/entregas/${delivery.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalles
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span className="sr-only">Toggle</span>
          </Button>
        </div>
      </div>

      {isOpen && (
        <CardContent className="p-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Fecha de Entrega</div>
                <div>{delivery.date}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Lugar de Entrega</div>
                <div>{delivery.deliveryLocationName}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Tipo de Entrega</div>
                <div>{delivery.deliveryType}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Remisión</div>
                <div>{delivery.remission || "N/A"}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Productos Entregados</div>
                <div>{totalProductsDelivered}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Cantidad Total</div>
                <div>{totalQuantityDelivered.toLocaleString()}</div>
              </div>
              {delivery.deliveredBy && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Entregado Por</div>
                  <div>{delivery.deliveredBy}</div>
                </div>
              )}
              {(delivery.vehicleInternal || delivery.vehicleExternal) && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Vehículo</div>
                  <div>{delivery.vehicleInternal || delivery.vehicleExternal}</div>
                </div>
              )}
            </div>

            {delivery.observations && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Observaciones</div>
                <div className="text-sm">{delivery.observations}</div>
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Productos Entregados</h4>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left p-2">Producto</th>
                      <th className="text-right p-2">Cantidad</th>
                      <th className="text-left p-2">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {delivery.products.map((product) => (
                      <tr key={product.productId} className="border-b last:border-0">
                        <td className="p-2">{getProductName(product.productId)}</td>
                        <td className="p-2 text-right">{product.quantity.toLocaleString()}</td>
                        <td className="p-2">{product.observations || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Imprimir Remisión
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

