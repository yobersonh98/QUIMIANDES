import type React from "react"
import { calcularPorcentaje, cn, getBgColorByEstado, getBorderColorByEstado } from "@/lib/utils"
import type { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import EstadoBadge from "../shared/estado-badge"
import { obtenerLugarEntregaDetallePedido } from "@/services/detalle-pedido/utils/detalle-pedido.util"

interface ProductCardProps {
  detalle: DetallePedidoEntity
  header?: (detallePedido: DetallePedidoEntity) => React.ReactNode
  footer?: (detallePedido: DetallePedidoEntity) => React.ReactNode
}

export default function ProductCard({ detalle, header, footer }: ProductCardProps) {
  const estadoDetallePedido = detalle.estado
  const porcentaje = calcularPorcentaje(detalle.cantidad, detalle.cantidadEntregada)

  // Determinar el color de la barra de progreso según el porcentaje y estado

  return (
    <Card
      className={cn(
        "border-l-4 overflow-hidden hover:shadow-md transition-shadow duration-300",
        getBorderColorByEstado(estadoDetallePedido),
      )}
    >
      {header && <CardHeader className="p-3">{header(detalle)}</CardHeader>}
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <h3 className="text-base font-medium">{detalle.producto.nombre}</h3>
            </div>
            <EstadoBadge estado={detalle.estado} />
          </div>

          {/* Fecha de entrega */}
          <p className="text-xs text-muted-foreground">
            Requerido para:{" "}
            {detalle.fechaEntrega ? new Date(detalle.fechaEntrega).toLocaleDateString() : "No especificada"}
          </p>

          {/* Información principal en formato compacto */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-1 text-sm">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Solicitada</span>
              <span className="font-medium">{detalle.cantidad.toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Despachada</span>
              <span className="font-medium">{(detalle.cantidadDespachada || 0).toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Entregada</span>
              <span className="font-medium">{(detalle.cantidadEntregada || 0).toLocaleString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Tipo Entrega</span>
              <span className="font-medium truncate">{detalle.tipoEntrega || "No especificado"}</span>
            </div>
            <div className="flex flex-col col-span-2 sm:col-span-1">
              <span className="text-xs text-muted-foreground">Lugar Entrega</span>
              <span className="font-medium truncate">
                {obtenerLugarEntregaDetallePedido(detalle) || "No especificado"}
              </span>
            </div>
          </div>

          {/* Barra de progreso compacta */}
          <div className="pt-1">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-700 dark:text-slate-300">Progreso de entrega</span>
              <span
                className={cn(
                  "font-medium px-1.5 py-0.5 rounded-full text-xs",
                  getBgColorByEstado(estadoDetallePedido),
                )}
              >
                {porcentaje}%
              </span>
            </div>

            {/* Contenedor de la barra */}
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              {/* Barra de progreso */}
              <div
                className={cn("h-full rounded-full transition-all duration-500", getBgColorByEstado(estadoDetallePedido))}
                style={{ width: `${porcentaje}%` }}
              />
            </div>

            {/* Indicadores de progreso simplificados */}
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </CardContent>
      {footer && <CardFooter className="p-2 pt-0">{footer(detalle)}</CardFooter>}
    </Card>
  )
}
