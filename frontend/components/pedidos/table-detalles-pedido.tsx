import React from 'react'
import { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity";
import { formatFecha } from '@/lib/utils';

type DetallesPedidosProps = {
  detallesPedidos: DetallePedidoEntity[]
}

export default function TableDetallesPedidos({detallesPedidos}: DetallesPedidosProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-center">ID</th>
                    <th className="p-2 text-center">Producto</th>
                    <th className="p-2 text-center">Fecha entrega.</th>
                    <th className="p-2 text-center">Unidad</th>
                    <th className="p-2 text-center">Cantidad</th>
                    <th className="p-2 text-center">Cant. Despachada</th>
                    <th className="p-2 text-center">Peso Recibido</th>
                    <th className="p-2 text-center">Tipo Entrega</th>
                    <th className="p-2 text-center">Lugar Entrega</th>
                    <th className="p-2 text-center">Ciudad</th>
                  </tr>
                </thead>
                <tbody>
                  {detallesPedidos.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2 text-center">{item.id}</td>
                      <td className="p-2 text-center">{item.producto.nombre}</td>
                      <td className="p-2 text-center">{formatFecha(item.fechaEntrega)}</td>
                      <td className="p-2 text-center">{item.unidades}</td>
                      <td className="p-2 text-center">{item.cantidad}</td>
                      <td className="p-2 text-center">{item.cantidadDespachada}</td>
                      <td className="p-2 text-center">{item.pesoRecibido}</td>
                      <td className="p-2 text-center">{item.tipoEntrega}</td>
                      <td className="p-2 text-center">{item.LugarEntrega?.nombre || 'N/A'}</td>
                      <td className="p-2 text-center">{item.LugarEntrega?.ciudad || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t bg-muted/50 font-medium">
                    <td colSpan={4} className="p-2 text-right">
                      Totales:
                    </td>
                    <td className="p-2 text-center">
                      {detallesPedidos.reduce((sum, product) => sum + product.cantidad, 0).toLocaleString()}
                    </td>
                    <td className="p-2 text-center">
                      {detallesPedidos
                        .reduce((sum, product) => sum + product.cantidadDespachada, 0)
                        .toLocaleString()}
                    </td>
                    <td className="p-2 text-center">
                      {detallesPedidos.reduce((sum, product) => sum + product.pesoRecibido, 0).toLocaleString()}
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
  )
}
