"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Truck } from "lucide-react"
import Link from "next/link"
import { EntregaEntity } from "@/services/entrega-pedido/entities/entrega.entity"
import { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity"
import { PedidoEntity } from "@/services/pedidos/entity/pedido.entity"
import { formatearFecha } from "@/lib/utils"
import EstadoBadge from "../shared/estado-badge"

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

    const productosEntrega = detallesPedido
      .flatMap(detalle =>
        detalle.entregasDetallePedido?.filter(producto =>
          producto.entregaId === entrega.id
        )
      )

    const getProductName = (detalleId: string) => {
      const detalle = detallesPedido.find(d => d.id === detalleId)
      return detalle ? detalle.producto.nombre : "Producto desconocido"
    }

    const totalProductsDelivered = productosEntrega.length
    const fechaEntrega = formatearFecha(entrega.fechaEntrega)
    const esPediente = entrega.estado === "PENDIENTE"
    const esEnTransito = entrega.estado === "EN_TRANSITO"
    return (
      <Card className="overflow-hidden">
        <div className="bg-muted/50 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-medium">
              {index + 1}
            </div>
            <div>
              <h3 className="font-medium">Entrega {entrega.id}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{fechaEntrega}</span>
                <span>•</span>
                <EstadoBadge estado={entrega.estado} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {esPediente && (
              <Link href={`/dashboard/pedidos/${pedidoId}/gestionar/entregas/${entrega.id}/despacho`}>
                <Button variant="outline" size="sm">
                  Confirmar Despacho
                </Button>
              </Link>
            )}

            {esEnTransito && (
              <Link href={`/dashboard/pedidos/${pedidoId}/gestionar/entregas/${entrega.id}/finalizar-entrega`}>
              <Button variant="outline" size="sm">
                Finalizar Entrega
              </Button>
            </Link>
            )}

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
                  <div className="text-sm font-medium text-muted-foreground">Estado</div>
                  <div><EstadoBadge estado={entrega.estado}/></div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Remisión</div>
                  <div>{entrega.remision || "N/A"}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Cantidad Productos</div>
                  <div>{totalProductsDelivered}</div>
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
                <h4 className="font-medium mb-2">Productos</h4>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left p-2">Producto</th>
                        <th className="text-right p-2">Cantidad Por Despachar</th>
                        <th className="text-right p-2">Cantidad Despachada</th>
                        <th className="text-right p-2">Cantidad Entregada</th>
                        <th className="text-left p-2">Observaciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosEntrega.map((producto) => (
                        <tr key={producto?.id} className="border-b last:border-0">
                          <td className="p-2">{getProductName(producto?.detallePedidoId || "")}</td>
                          <td className="p-2 text-right">{producto?.cantidadDespachar.toLocaleString()}</td>
                          <td className="p-2 text-right">{producto?.cantidadDespachada.toLocaleString()}</td>
                          <td className="p-2 text-right">{producto?.cantidadEntregada.toLocaleString()}</td>
                          <td className="p-2">{producto?.observaciones || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
              </div>
            </div>
          </CardContent>
        )}  
      </Card>
    )
  }