"use client"
import DataTableDefaultRowAcciones from "@/components/shared/data-table-default-acciones"
import { formatFecha } from "@/lib/utils"
import { obtenerLugarEntregaDetallePedido } from "@/services/detalle-pedido/utils/detalle-pedido.util"
import type { PedidoDataTable } from "@/services/pedidos/entity/pedido.entity"
import type { ColumnDef } from "@tanstack/react-table"
import { ChevronDown, ChevronRight, PackageCheck } from 'lucide-react'
import { TruncatedTextWithTooltip } from "../shared/trunkated-tooltip"
import EstadoBadge from "../shared/estado-badge"
import { Button } from "../ui/button"

export const PedidoColumns: ColumnDef<PedidoDataTable>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <Button variant="ghost" onClick={row.getToggleExpandedHandler()} className="p-0 w-6 h-6">
          {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      ) : null
    },
  },
  {
    header: "Código",
    accessorKey: "codigo",
  },
  {
    header: "Cliente",
    accessorKey: "cliente",
    cell: (cell) => <p>{cell.cell.row.original.cliente?.nombre}</p>,
  },
  {
    header: "Estado",
    accessorKey: "estado",
    cell: (cell) => <EstadoBadge estado={cell.cell.row.original.estado || ""} />,
  },
  {
    header: "Fecha Pedido",
    accessorKey: "fechaRecibido",
    cell: ({ cell }) => <p>{formatFecha(cell.row.original.fechaRecibido, "fecha")}</p>,
  },
  {
    header: "Productos",
    accessorKey: "_count",
    cell: ({ cell }) => <p>{cell.row.original._count?.detallesPedido}</p>,
  },
  {
    header: "Lugar Entrega",
    accessorKey: "detallesPedido",
    cell: ({ cell }) => {
      const detallesPedido = cell.row.original.detallesPedido
      const direccionPrincipalCliente = cell.row.original.cliente?.direccion
      const lugares = detallesPedido?.map((detalle) => obtenerLugarEntregaDetallePedido(detalle)).join(" / ")
      return <TruncatedTextWithTooltip text={lugares || direccionPrincipalCliente || '-'} />
    },
  },
  {
    header: "Acciones",
    accessorKey: "idCliente",
    cell: (cell) => {
      return (
        <DataTableDefaultRowAcciones
          modifyTitle="Gestionar Entrega"
          viewTitle="Ver Pedido"
          ModifyIcon={<PackageCheck size={18} />}
          pathName={`/dashboard/pedidos/${cell.row.original.id}`}
          modifyPathName={`/dashboard/pedidos/${cell.row.original.id}/gestionar`}
        />
      )
    },
  },
]