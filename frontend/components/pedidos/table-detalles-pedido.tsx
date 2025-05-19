import React from "react";
import { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity";
import { formatFecha } from "@/lib/utils";
import EstadoBadge from "../shared/estado-badge";
import { getUnidadMedidaLabel } from "@/utils/unidades";
import { TipoEntregaProducto } from "@/core/constantes/pedido";

type DetallesPedidosProps = {
  detallesPedidos: DetallePedidoEntity[];
};

export default function TableDetallesPedidos({
  detallesPedidos,
}: DetallesPedidosProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-2 text-center" hidden>
              ID
            </th>
            <th className="p-2 text-center">Producto</th>
            <th className="p-2 text-center">Estado</th>
            <th className="p-2 text-center">Fecha entrega</th>
            <th className="p-2 text-center">Unidad</th>
            <th className="p-2 text-center">Cantidad</th>
            <th className="p-2 text-center">Total</th>
            <th className="p-2 text-center">Cant. Despachada</th>
            <th className="p-2 text-center">Cant. Entregada</th>
            <th className="p-2 text-center">Tipo Entrega</th>
            <th className="p-2 text-center">Lugar Entrega</th>
            <th className="p-2 text-center">Ciudad</th>
          </tr>
        </thead>
        <tbody>
          {detallesPedidos.map((item) => {
            const pesoTotal = item.pesoTotal || 0;
            const nombreLugar = item.lugarEntrega ? item.lugarEntrega.nombre : "N/A";
            const nombreCiudad = item.lugarEntrega && item.lugarEntrega.ciudad 
              ? item.lugarEntrega.ciudad.nombre 
              : "N/A";
            const unidadMedida = item.producto.unidadMedida;

            return (
              <tr key={item.id} className="border-b">
                <td className="p-2 text-center" hidden>
                  {item.id}
                </td>
                <td className="p-2 text-center">{item.producto.nombre}</td>
                <td className="p-2 text-center">
                  <EstadoBadge estado={item.estado} />
                </td>
                <td className="p-2 text-center">
                  {formatFecha(item.fechaEntrega)}
                </td>
                <td className="p-2 text-center">
                  {getUnidadMedidaLabel(unidadMedida)}
                </td>
                <td className="p-2 text-center">
                  {item.cantidad.toLocaleString()}
                </td>
                <td className="p-2 text-center">
                  {pesoTotal.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })} {getUnidadMedidaLabel(unidadMedida)}
                </td>
                <td className="p-2 text-center">{item.cantidadDespachada}</td>
                <td className="p-2 text-center">{item.cantidadEntregada}</td>
                <td className="p-2 text-center">
                  {item.tipoEntrega === TipoEntregaProducto.ENTREGA_AL_CLIENTE 
                    ? "Entrega" 
                    : "Recoge"}
                </td>
                <td className="p-2 text-center">{nombreLugar}</td>
                <td className="p-2 text-center">{nombreCiudad}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t bg-muted/50 font-medium">
            <td colSpan={4} className="p-2 text-right">
              Totales:
            </td>
            <td className="p-2 text-center">
              {detallesPedidos
                .reduce((sum, p) => sum + p.cantidad, 0)
                .toLocaleString()}
            </td>
            <td className="p-2 text-center">
              {detallesPedidos
                .reduce((sum, p) => sum + (p.pesoTotal || 0), 0)
                .toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </td>
            <td className="p-2 text-center">
              {detallesPedidos
                .reduce((sum, p) => sum + p.cantidadDespachada, 0)
                .toLocaleString()}
            </td>
            <td className="p-2 text-center">
              {detallesPedidos
                .reduce((sum, p) => sum + p.cantidadEntregada, 0)
                .toLocaleString()}
            </td>
            <td colSpan={3}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}