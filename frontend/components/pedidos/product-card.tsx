import { calcularPorcentaje, cn } from "@/lib/utils";
import { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import EstadoBadge from "../shared/estado-badge";
import { Progress } from "@radix-ui/react-progress";
import { InfoItem } from "../shared/info-item";

interface ProductCardProps {
  detalle: DetallePedidoEntity;
  header?: (detallePedido: DetallePedidoEntity) => React.ReactNode;
  footer?: (detallePedido: DetallePedidoEntity) => React.ReactNode;
}

export default function ProductCard({ detalle, header, footer }: ProductCardProps) {
  const estadoDetallePedido = detalle.estado;
  const porcentaje = calcularPorcentaje(detalle.cantidad, detalle.cantidadEntregada)

  return (
    <Card
      className={cn(
        "border-l-4",
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

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progreso de entrega</span>
              <span>{porcentaje}%</span>
            </div>
            <Progress value={porcentaje} className="h-2 bg-primary rounded-sm" />
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
