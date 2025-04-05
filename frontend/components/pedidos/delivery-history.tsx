"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Eye, FileText, Truck } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { EntregaEntity } from "@/services/entrega-pedido/entities/entrega.entity"
import { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { PedidoEntity } from "@/services/pedidos/entity/pedido.entity"

type DeliveryHistoryProps = {
  pedido: PedidoEntity
}

export function DeliveryHistory({ pedido }: DeliveryHistoryProps) {
  // Verificar si hay entregas disponibles
  const entregas = pedido.entregas || []

  if (entregas.length === 0) {
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
      {entregas.map((entrega, index) => (
        <DeliveryCard 
          key={entrega.id} 
          entrega={entrega} 
          detallesPedido={pedido.detallesPedido}
          index={index} 
          pedidoId={pedido.id} 
        />
      ))}
    </div>
  )
}

function DeliveryCard({
  entrega,
  detallesPedido,
  index,
  pedidoId,
}: {
  entrega: EntregaEntity
  detallesPedido: DetallePedidoEntity[]
  index: number
  pedidoId: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  // Obtener los productos de esta entrega
  const productosEntrega = detallesPedido
    .flatMap(detalle => 
      detalle.entregasDetallePedido?.filter(producto => 
        producto.entregaId === entrega.id
      )
    )

  // Función para obtener el nombre del producto a partir de su ID de detalle
  const getProductName = (detalleId: string) => {
    const detalle = detallesPedido.find(d => d.id === detalleId)
    return detalle ? detalle.producto.nombre : "Producto desconocido"
  }

  // Obtener lugar de entrega
  const getLugarEntrega = () => {
    const lugarId = entrega.lugarEntregaId
    const detalle = detallesPedido.find(d => d.lugarEntregaId === lugarId)
    return detalle?.lugarEntrega?.nombre || "Lugar no especificado"
  }
  
  // Calcular el total de productos entregados
  const totalProductsDelivered = productosEntrega.length

  // Calcular la cantidad total entregada
  const totalQuantityDelivered = productosEntrega.reduce(
    (sum, producto) => sum + (producto?.cantidadEntregada || 0), 0
  )

  // Formatear fecha de entrega si está disponible
  const fechaEntrega = entrega.id 
    ? format(new Date(), "dd-MMM-yyyy", { locale: es })
    : "Fecha no disponible"

  // Estado de la entrega como badge
  // const getEstadoBadge = (estado: string) => {
  //   const variants = {
  //     "PENDIENTE": "outline",
  //     "EN_TRANSITO": "secondary",
  //     "ENTREGADO": "success",
  //     "CANCELADO": "destructive"
  //   }
  //   return variants[estado as keyof typeof variants] || "default"
  // }

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
              <span>{fechaEntrega}</span>
              <span>•</span>
              <span>{getLugarEntrega()}</span>
              <span>•</span>
              <Badge
                // variant={getEstadoBadge(entrega.estado)}
              >
                {entrega.estado}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Link href={`/dashboard/pedidos/${pedidoId}/entregas/${entrega.id}`}>
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
                <div>{fechaEntrega}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Lugar de Entrega</div>
                <div>{getLugarEntrega()}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Estado</div>
                <div>{entrega.estado}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Remisión</div>
                <div>{entrega.remision || "N/A"}</div>
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
              {entrega.entregadoPorA && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Entregado Por</div>
                  <div>{entrega.entregadoPorA}</div>
                </div>
              )}
              {(entrega.vehiculoInterno || entrega.vehiculoExterno) && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Vehículo</div>
                  <div>{entrega.vehiculoInterno || entrega.vehiculoExterno}</div>
                </div>
              )}
            </div>

            {entrega.observaciones && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Observaciones</div>
                <div className="text-sm">{entrega.observaciones}</div>
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
                    {productosEntrega.map((producto) => (
                      <tr key={producto?.id} className="border-b last:border-0">
                        <td className="p-2">{getProductName(producto?.detallePedidoId || "")}</td>
                        <td className="p-2 text-right">{producto?.cantidadEntregada.toLocaleString()}</td>
                        <td className="p-2">{producto?.observaciones || "-"}</td>
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