"use client"
import { ColumnDef } from "@tanstack/react-table"
import { formatFecha } from "@/lib/utils"
import { Truck, CheckCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EntregaListadoItemEntity } from "@/services/entrega-pedido/entities/listado-entrega-item.entity"
import EstadoBadge from "../shared/estado-badge"

export const EntregaColumns: ColumnDef<EntregaListadoItemEntity>[] = [
  {
    header: 'ID',
    accessorKey: 'id'
  },
  {
    header: 'Pedido ID',
    accessorKey: 'pedidoId'
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
      <p>{formatFecha(row.original.fechaCreacion, "fechaHora")}</p>
    )
  },
  {
    header: 'Fecha Entrega',
    accessorKey: 'fechaEntrega',
    cell: ({ row }) => (
      <p>{row.original.fechaEntrega ? formatFecha(row.original.fechaEntrega, "fechaHora") : 'Sin Fecha'}</p>
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
