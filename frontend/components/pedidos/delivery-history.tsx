"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Truck } from "lucide-react"
import type { EntregaEntity } from "@/services/entrega-pedido/entities/entrega.entity"
import type { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity"
import type { PedidoEntity } from "@/services/pedidos/entity/pedido.entity"
import { formatearFecha } from "@/lib/utils"
import EstadoBadge from "../shared/estado-badge"
import CancelarEntregaButton from "../entregas/cancelar-entrega-button"
import { obtenerLugarEntregaDetallePedido } from "@/services/detalle-pedido/utils/detalle-pedido.util"
import { EntregaProdcutoEntity } from "@/services/entrega-pedido/entities/entrega-producto.entity"

type DeliveryHistoryProps = {
  pedido: PedidoEntity
}

export function DeliveryHistory({ pedido }: DeliveryHistoryProps) {
  // Verificar si hay entregas disponibles
  const entregas = pedido.entregas || []

  if (entregas.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <Truck className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-base font-medium mb-1">No hay entregas registradas</h3>
          <p className="text-sm text-muted-foreground">
            Utilice el botón Registrar Entrega para comenzar a registrar entregas para este pedido.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
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

  const productosEntrega = detallesPedido.flatMap((detalle) =>
    detalle.entregasDetallePedido?.filter((producto) => producto.entregaId === entrega.id),
  )

  const getProductName = (detalleId: string) => {
    const detalle = detallesPedido.find((d) => d.id === detalleId)
    return detalle ? detalle.producto.nombre : "Producto desconocido"
  }

  const totalProductsDelivered = productosEntrega.length
  const fechaEntrega = formatearFecha(entrega.fechaEntrega)
  const esPediente = entrega.estado === "PENDIENTE"
  const esEnTransito = entrega.estado === "EN_TRANSITO"
  const getDetallePedidoDeEntregaProducto = (entregaProducto?: EntregaProdcutoEntity) => {
    return detallesPedido.find((detalle) => detalle.id === entregaProducto?.detallePedidoId)
  }
  return (
    <Card className="overflow-hidden">
      <div className="bg-muted/50 p-2 sm:p-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium shrink-0">
            {index + 1}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-sm truncate">Entrega {entrega.codigo}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="truncate">{fechaEntrega}</span>
              <span>•</span>
              <EstadoBadge estado={entrega.estado} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto ml-auto">
          {(esPediente || esEnTransito) && <CancelarEntregaButton entregaId={entrega.id} />}

          {esPediente && (
            <Link href={`/dashboard/pedidos/${pedidoId}/gestionar/entregas/${entrega.id}/despacho`}>
              <Button variant="outline" className="text-xs h-7 px-2">
                Confirmar Despacho
              </Button>
            </Link>
          )}

          {esEnTransito && (
            <Link href={`/dashboard/pedidos/${pedidoId}/gestionar/entregas/${entrega.id}/finalizar-entrega`}>
              <Button variant="outline" className="text-xs h-7 px-2">
                Finalizar Entrega
              </Button>
            </Link>
          )}

          <Button variant="ghost" className="h-7 w-7 p-0" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            <span className="sr-only">Toggle</span>
          </Button>
        </div>
      </div>

      {isOpen && (
        <CardContent className="p-2 sm:p-3 text-sm">
          <div className="space-y-3">
            {/* Información básica */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <InfoItem label="Fecha de Entrega" value={fechaEntrega} />
              <InfoItem label="Estado" value={<EstadoBadge estado={entrega.estado} />} />
              <InfoItem label="Remisión" value={entrega.remision || "N/A"} />
              <InfoItem label="Cantidad Productos" value={totalProductsDelivered.toString()} />

              {entrega.entregadoPorA && <InfoItem label="Entregado Por" value={entrega.entregadoPorA} />}

              {(entrega.vehiculoInterno || entrega.vehiculoExterno) && (
                <InfoItem label="Vehículo" value={entrega.vehiculoInterno || entrega.vehiculoExterno || ""} />
              )}
            </div>

            {/* Observaciones */}
            {entrega.observaciones && (
              <div>
                <div className="text-xs font-medium text-muted-foreground">Observaciones</div>
                <div className="text-xs mt-0.5">{entrega.observaciones}</div>
              </div>
            )}

            {/* Tabla de productos */}
            <div>
              <h4 className="text-xs font-medium mb-1">Productos</h4>
              <div className="border rounded-md overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left p-1.5">Producto</th>
                      <th className="text-right p-1.5 whitespace-nowrap">Cant. Por Despachar</th>
                      <th className="text-right p-1.5 whitespace-nowrap">Cant. Despachada</th>
                      <th className="text-right p-1.5 whitespace-nowrap">Cant. Entregada</th>
                      <th className="text-left p-1.5 whitespace-nowrap">Lugar de Entrega</th>
                      <th className="text-left p-1.5">Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosEntrega.map((producto) => (
                      <tr key={producto?.id} className="border-b last:border-0">
                        <td className="p-1.5">{getProductName(producto?.detallePedidoId || "")}</td>
                        <td className="p-1.5 text-right">{producto?.cantidadDespachar.toLocaleString()}</td>
                        <td className="p-1.5 text-right">{producto?.cantidadDespachada.toLocaleString()}</td>
                        <td className="p-1.5 text-right">{producto?.cantidadEntregada.toLocaleString()}</td>
                        <td className="p-1.5">
                          {obtenerLugarEntregaDetallePedido(getDetallePedidoDeEntregaProducto(producto))}
                        </td>
                        <td className="p-1.5">{producto?.observaciones || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// Componente auxiliar para mostrar información
function InfoItem({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate">{value}</div>
    </div>
  )
}
