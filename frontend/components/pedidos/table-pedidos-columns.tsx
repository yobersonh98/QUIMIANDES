"use client"
import DataTableDefaultRowAcciones from "@/components/shared/data-table-default-acciones";
import { formatFecha } from "@/lib/utils";
import { obtenerLugarEntregaDetallePedido } from "@/services/detalle-pedido/utils/detalle-pedido.util";
import { PedidoDataTable } from "@/services/pedidos/entity/pedido.entity";
import { ColumnDef } from "@tanstack/react-table";
import { PackageCheck } from "lucide-react";
import { TruncatedTextWithTooltip } from "../shared/trunkated-tooltip";

export const PedidoColumns: ColumnDef<PedidoDataTable>[] = [
  {header: 'Código',
    accessorKey: 'codigo'
  },
  {
    header: "Cliente",
    accessorKey: "cliente",
    cell: (cell) => (
      <p>
        {cell.cell.row.original.cliente?.nombre}
      </p>
    )
  },
  {
    header: "Estado",
    accessorKey: "estado"
  },
  { header: "Fecha Pedido",
    accessorKey:'fechaRecibido',
    cell: ({cell})=> (
      <p>
        {formatFecha(cell.row.original.fechaRecibido, "fecha")}
      </p>
    )
  },
  {
    header: "Productos",
    accessorKey: "_count",
    cell: ({cell}) => (
      <p>
        {cell.row.original._count?.detallesPedido}
      </p>
    )
  },
  {
    header: "Lugar Entrega",
    accessorKey: "detallesPedido",
    cell: ({cell}) => {
      const detallesPedido = cell.row.original.detallesPedido;
      const lugares = detallesPedido?.map(detalle=> obtenerLugarEntregaDetallePedido(detalle)).join(" - ");
      return (
        <TruncatedTextWithTooltip 
          text={lugares || "N/A"}
        />
      )
      }
  },
  {
    header: "Acciones",
    accessorKey:"idCliente",
    cell: (cell) => {
      return (
        <DataTableDefaultRowAcciones modifyTitle="Gestionar Entrega" viewTitle="Ver Pedido" ModifyIcon={<PackageCheck size={18}/>}
          pathName={`/dashboard/pedidos/${cell.row.original.id}`}
          modifyPathName={`/dashboard/pedidos/${cell.row.original.id}/gestionar`}
        />
      );
    }
  }

]