"use client"
import { ColumnDef } from "@tanstack/react-table"
import { formatFecha } from "@/lib/utils"
import { Truck, CheckCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EntregaListadoItemEntity } from "@/services/entrega-pedido/entities/listado-entrega-item.entity"
import EstadoBadge from "../shared/estado-badge"
import { TruncatedTextWithTooltip } from "../shared/trunkated-tooltip"
import { obtenerLugarEntregaDetallePedido } from "@/services/detalle-pedido/utils/detalle-pedido.util"

export const EntregaColumns: ColumnDef<EntregaListadoItemEntity>[] = [
  {
    header: 'Código',
    accessorKey: 'codigo'
  },
  {
    header: 'Pedido Código',
    accessorKey: 'pedido.codigo',
  },
  {
    header: 'Cliente',
    accessorKey: 'pedido.cliente.nombre',
    cell: ({ row }) => (
      <p>{row.original.pedido.cliente.nombre}</p>
    )
  },
  {
    header: 'Dirección Entrega',
    accessorKey: 'direccionEntrega',
    cell: ({ row }) => (
      <TruncatedTextWithTooltip 
        text={row.original.entregaProductos.map(en=> obtenerLugarEntregaDetallePedido(en.detallePedido)).join(' - ') || 'N/A'}
      />
    )
  },
  {
    header: 'Estado',
    accessorKey: 'estado',
    cell: ({row}) => (
      <EstadoBadge estado={row.original.estado} />
    )
  },
  {
    header: 'Fecha Creación',
    accessorKey: 'fechaCreacion',
    cell: ({ row }) => (
      <p>{formatFecha(row.original.fechaCreacion)}</p>
    )
  },
  {
    header: 'Fecha Entrega',
    accessorKey: 'fechaEntrega',
    cell: ({ row }) => (
      <p>{row.original.fechaEntrega ? formatFecha(row.original.fechaEntrega) : 'Sin Fecha'}</p>
    )
  },
  {
    header: 'Productos',
    accessorKey: 'cantidadProductos'
  },
  {
    header: 'Vehículo',
    accessorKey: 'vehiculoInterno',
    cell: ({ row }) => (
      <p>{row.original.vehiculoInterno || row.original.vehiculoExterno || 'N/A'}</p>
    )
  },

  {
    header: 'Entregado Por',
    accessorKey: 'entregadoPorA',
    cell: ({ row }) => (
      <p>{row.original.entregadoPorA || row.original.entregadoPorA || 'N/A'}</p>
    )
  },
  {
    header: 'Acciones',
    accessorKey: 'acciones',
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <Link href={`/dashboard/pedidos/${row.original.pedidoId}/gestionar/entregas/${row.original.id}/despacho`}>
            <Button variant="secondary" size="sm" title="Visualizar Despacho">
              <Truck size={16} className="" />
            </Button>
          </Link>
          <Link href={`/dashboard/pedidos/${row.original.pedidoId}/gestionar/entregas/${row.original.id}/finalizar-entrega`}>
            <Button variant="default" size="sm" title="Finalizar Entrega">
              <CheckCheck size={16} className="" />
            </Button>
          </Link>
        </div>
      )
    }
  }
]
