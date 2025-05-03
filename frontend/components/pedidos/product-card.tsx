import { calcularPorcentaje, cn } from "@/lib/utils";
import { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import EstadoBadge from "../shared/estado-badge";
import { InfoItem } from "../shared/info-item";

interface ProductCardProps {
  detalle: DetallePedidoEntity;
  header?: (detallePedido: DetallePedidoEntity) => React.ReactNode;
  footer?: (detallePedido: DetallePedidoEntity) => React.ReactNode;
}

export default function ProductCard({ detalle, header, footer }: ProductCardProps) {
  const estadoDetallePedido = detalle.estado;
  const porcentaje = calcularPorcentaje(detalle.cantidad, detalle.cantidadEntregada);
  
  // Determinar el color de la barra de progreso según el porcentaje y estado
  const getProgressColor = () => {
    if (estadoDetallePedido === "ENTREGADO") return "bg-green-500";
    if (estadoDetallePedido === "PARCIAL") return "bg-yellow-500";
    if (porcentaje >= 75) return "bg-emerald-500";
    if (porcentaje >= 50) return "bg-blue-500";
    if (porcentaje >= 25) return "bg-amber-500";
    return "bg-slate-500";
  };

  return (
    <Card
      className={cn(
        "border-l-4 overflow-hidden hover:shadow-md transition-shadow duration-300",
        estadoDetallePedido === "ENTREGADO"
          ? "border-l-green-500"
          : estadoDetallePedido === "PARCIAL"
            ? "border-l-yellow-500"
            : "border-l-blue-500",
      )}
    >
      {header && (
        <CardHeader>
          {header(detalle)}
        </CardHeader>
      )}
      <CardContent className="p-4">
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                {detalle.producto.nombre}
                <span className="text-sm font-normal text-muted-foreground">({detalle.id})</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Requerido para: {detalle.fechaEntrega ? new Date(detalle.fechaEntrega).toLocaleDateString() : "No especificada"}
              </p>
            </div>
            <div>
              <EstadoBadge
                estado={detalle.estado}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem
              label="Cantidad Solicitada"
              value={detalle.cantidad.toLocaleString()}
            />
            <InfoItem
              label="Cantidad Despachada"
              value={(detalle.cantidadDespachada || 0).toLocaleString()}
            />
            <InfoItem
              label="Cantidad Entregada"
              value={(detalle.cantidadEntregada || 0).toLocaleString()}
            />
            <InfoItem
              label="Tipo de Entrega"
              value={detalle.tipoEntrega || "No especificado"}
            />
            <InfoItem
              label="Lugar de Entrega"
              value={
                `${detalle.lugarEntrega?.nombre || "No especificado"}, ` +
                `${detalle.lugarEntrega?.ciudad?.nombre || "No especificada"}`
              }
            />
          </div>

          {/* Barra de progreso mejorada con Tailwind */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <div className="font-medium text-slate-700 dark:text-slate-300">
                Progreso de entrega
              </div>
              <div className={cn(
                "font-semibold px-2 py-0.5 rounded-full text-xs",
                porcentaje === 100 
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                  : porcentaje >= 50
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
              )}>
                {porcentaje}%
              </div>
            </div>
            
            {/* Contenedor de la barra */}
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              {/* Barra de progreso */}
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  getProgressColor()
                )}
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            
            {/* Indicadores de progreso */}
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                <span>0%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={cn("w-1 h-1 rounded-full", porcentaje >= 25 ? getProgressColor() : "bg-slate-400")}></div>
                <span>25%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={cn("w-1 h-1 rounded-full", porcentaje >= 50 ? getProgressColor() : "bg-slate-400")}></div>
                <span>50%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={cn("w-1 h-1 rounded-full", porcentaje >= 75 ? getProgressColor() : "bg-slate-400")}></div>
                <span>75%</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={cn("w-1 h-1 rounded-full", porcentaje >= 100 ? getProgressColor() : "bg-slate-400")}></div>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      {footer && (
        <CardFooter>
          {footer(detalle)}
        </CardFooter>
      )}
    </Card>
  )
}