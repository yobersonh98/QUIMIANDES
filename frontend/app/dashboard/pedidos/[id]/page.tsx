import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Pencil } from "lucide-react"
import Link from "next/link"

// En producción, estos datos vendrían de la base de datos
const orderData = {
  id: "PC-001",
  orderDate: "20-dic",
  client: {
    name: "Aguas kapital",
    document: "901234567-8",
  },
  requirementDate: "Diferentes Fechas",
  status: "Entregado Parcialmente",
  purchaseOrder: "OC-010931",
  totalWeight: 53500,
  totalValue: 121960000,
  products: [
    {
      id: "PC-001.1",
      name: "PHCA-20",
      requirementDate: "29-dic",
      presentation: "Granel",
      unit: 1,
      quantity: 34000,
      dispatchedQuantity: 34000,
      total: 34000,
      receivedWeight: 34000,
      deliveryType: "Entrega al Cliente",
      deliveryLocation: "Planta Porfice",
      city: "Cúcuta",
    },
    {
      id: "PC-001.2",
      name: "PAC-19",
      requirementDate: "30-dic",
      presentation: "Caneca 250kg",
      unit: 250,
      quantity: 20,
      dispatchedQuantity: 5000,
      total: 5000,
      receivedWeight: 5000,
      deliveryType: "Recoge en Planta",
      deliveryLocation: "Planta Quimandes",
      city: "Cúcuta",
    },
    {
      id: "PC-001.3",
      name: "Cloro Gaseoso",
      requirementDate: "31-dic",
      presentation: "Contenedor",
      unit: 900,
      quantity: 5,
      dispatchedQuantity: 4500,
      total: 4500,
      receivedWeight: 4500,
      deliveryType: "Entrega al Cliente",
      deliveryLocation: "Planta Tonchala",
      city: "Tonchala",
    },
    {
      id: "PC-001.4",
      name: "Soda Caustica",
      requirementDate: "01-ene",
      presentation: "Granel",
      unit: 1,
      quantity: 5000,
      dispatchedQuantity: 5000,
      total: 5000,
      receivedWeight: 5000,
      deliveryType: "Entrega al Cliente",
      deliveryLocation: "Planta Bocatoma",
      city: "Cúcuta",
    },
    {
      id: "PC-001.5",
      name: "Acido Clorhidrico",
      requirementDate: "02-ene",
      presentation: "Granel",
      unit: 1,
      quantity: 5000,
      dispatchedQuantity: 5000,
      total: 5000,
      receivedWeight: 5000,
      deliveryType: "Entrega al Cliente",
      deliveryLocation: "Planta Porfice",
      city: "Cúcuta",
    },
  ],
  observations: "Entrega en diferentes fechas según programación",
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Link href="/dashboard/pedidos">
                <ChevronLeft className="h-4 w-4" />
                Volver
              </Link>
            </Button>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Pedido {orderData.id}</h2>
        </div>
        <Button>
          <Link href={`/dashboard/pedidos/${params.id}/editar`}>
            <Pencil className="h-4 w-4 mr-2" />
            Editar Pedido
          </Link>
        </Button>
      </div>

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
                <div>{orderData.status}</div>
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-left">Fecha Req.</th>
                    <th className="p-2 text-left">Presentación</th>
                    <th className="p-2 text-right">Unidad</th>
                    <th className="p-2 text-right">Cantidad</th>
                    <th className="p-2 text-right">Cant. Despachada</th>
                    <th className="p-2 text-right">Peso Recibido</th>
                    <th className="p-2 text-left">Tipo Entrega</th>
                    <th className="p-2 text-left">Lugar Entrega</th>
                    <th className="p-2 text-left">Ciudad</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="p-2">{product.id}</td>
                      <td className="p-2">{product.name}</td>
                      <td className="p-2">{product.requirementDate}</td>
                      <td className="p-2">{product.presentation}</td>
                      <td className="p-2 text-right">{product.unit}</td>
                      <td className="p-2 text-right">{product.quantity.toLocaleString()}</td>
                      <td className="p-2 text-right">{product.dispatchedQuantity.toLocaleString()}</td>
                      <td className="p-2 text-right">{product.receivedWeight.toLocaleString()}</td>
                      <td className="p-2">{product.deliveryType}</td>
                      <td className="p-2">{product.deliveryLocation}</td>
                      <td className="p-2">{product.city}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t bg-muted/50 font-medium">
                    <td colSpan={5} className="p-2 text-right">
                      Totales:
                    </td>
                    <td className="p-2 text-right">
                      {orderData.products.reduce((sum, product) => sum + product.quantity, 0).toLocaleString()}
                    </td>
                    <td className="p-2 text-right">
                      {orderData.products
                        .reduce((sum, product) => sum + product.dispatchedQuantity, 0)
                        .toLocaleString()}
                    </td>
                    <td className="p-2 text-right">
                      {orderData.products.reduce((sum, product) => sum + product.receivedWeight, 0).toLocaleString()}
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {orderData.observations && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{orderData.observations}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

