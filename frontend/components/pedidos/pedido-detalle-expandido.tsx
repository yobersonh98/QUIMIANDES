import { formatFecha } from "@/lib/utils"
import type { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity"
import { obtenerLugarEntregaDetallePedido } from "@/services/detalle-pedido/utils/detalle-pedido.util"
import EstadoBadge from "@/components/shared/estado-badge"

interface PedidoDetalleExpandidoProps {
  detallesPedido: DetallePedidoEntity[]
}

export function PedidoDetalleExpandido({ detallesPedido }: PedidoDetalleExpandidoProps) {
  // Verifica los detalles recibidos

  if (!detallesPedido || detallesPedido.length === 0) {
    return <div className="text-center py-4">No hay detalles disponibles para este pedido</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Detalles del Pedido</h3>
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-2 text-left">Producto</th>
              <th className="p-2 text-left">Estado</th>
              <th className="p-2 text-left">Fecha Entrega</th>
              <th className="p-2 text-left">Lugar Entrega</th>
              <th className="p-2 text-right">Cantidad</th>
              <th className="p-2 text-right">Despachado</th>
              <th className="p-2 text-right">Entregado</th>
            </tr>
          </thead>
          <tbody>
            {detallesPedido.map((detalle) => {
              // Verifica cada detalle
              
              return (
                <tr key={detalle.id} className="border-b last:border-0">
                  <td className="p-2">
                    <div className="font-medium">{detalle.producto?.nombre || "Sin nombre"}</div>
                    <div className="text-xs text-muted-foreground">{detalle.codigo}</div>
                  </td>
                  <td className="p-2">
                    <EstadoBadge estado={detalle.estado || ""} />
                  </td>
                  <td className="p-2">
                    {detalle.fechaEntrega ? formatFecha(detalle.fechaEntrega.toString(), "fecha") : "No definida"}
                  </td>
                  <td className="p-2">
                    <div className="text-sm">
                      {obtenerLugarEntregaDetallePedido(detalle)}
                    </div>
                  </td>
                  <td className="p-2 text-right">{detalle.cantidad?.toLocaleString() || 0}</td>
                  <td className="p-2 text-right">{detalle.cantidadDespachada?.toLocaleString() || 0}</td>
                  <td className="p-2 text-right">{detalle.cantidadEntregada?.toLocaleString() || 0}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}