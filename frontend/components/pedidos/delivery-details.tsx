import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Calendar, MapPin, FileText, User, TruckIcon } from "lucide-react"

type DeliveryProduct = {
  productId: string
  productName: string
  presentation: string
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
  client: {
    name: string
    document: string
  }
}

type DeliveryDetailsProps = {
  delivery: Delivery
  orderData: OrderData
}

export function DeliveryDetails({ delivery, orderData }: DeliveryDetailsProps) {
  // Calcular la cantidad total entregada
  const totalQuantity = delivery.products.reduce((sum, product) => sum + product.quantity, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Información de la Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Fecha de Entrega</div>
                  <div>{delivery.date}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Lugar de Entrega</div>
                  <div>{delivery.deliveryLocationName}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <TruckIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Tipo de Entrega</div>
                  <div>{delivery.deliveryType}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Remisión</div>
                  <div>{delivery.remission || "Sin remisión"}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Información del Cliente
            </CardTitle>
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
              <div>
                <div className="text-sm font-medium text-muted-foreground">Pedido</div>
                <div>{orderData.id}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Total Entregado</div>
                <div>{totalQuantity.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Detalles de Transporte
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {delivery.vehicleInternal && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Vehículo Interno</div>
                <div>{delivery.vehicleInternal}</div>
              </div>
            )}
            {delivery.vehicleExternal && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Vehículo Externo</div>
                <div>{delivery.vehicleExternal}</div>
              </div>
            )}
            {delivery.deliveredBy && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Entregado Por</div>
                <div>{delivery.deliveredBy}</div>
              </div>
            )}
          </div>
          {delivery.observations && (
            <div>
              <div className="text-sm font-medium text-muted-foreground">Observaciones</div>
              <div className="p-3 bg-muted/50 rounded-md mt-1">{delivery.observations}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Productos Entregados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left p-3 font-medium">Producto</th>
                  <th className="text-left p-3 font-medium">Presentación</th>
                  <th className="text-right p-3 font-medium">Cantidad</th>
                  <th className="text-left p-3 font-medium">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {delivery.products.map((product, index) => (
                  <tr key={product.productId} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="p-3 border-b">
                      <div className="font-medium">{product.productName}</div>
                      <div className="text-xs text-muted-foreground">{product.productId}</div>
                    </td>
                    <td className="p-3 border-b">
                      <Badge variant="outline">{product.presentation}</Badge>
                    </td>
                    <td className="p-3 border-b text-right font-medium">{product.quantity.toLocaleString()}</td>
                    <td className="p-3 border-b">{product.observations || "-"}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50">
                  <td colSpan={2} className="p-3 text-right font-medium">
                    Total:
                  </td>
                  <td className="p-3 text-right font-medium">{totalQuantity.toLocaleString()}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

