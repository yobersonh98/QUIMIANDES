"use client"
import DataTableDefaultRowAcciones from "@/components/shared/data-table-default-acciones";
import { formatFecha } from "@/lib/utils";
import { PedidoDataTable } from "@/services/pedidos/entity/pedido.entity";
import { ColumnDef } from "@tanstack/react-table";
import { PackageCheck } from "lucide-react";

export const PedidoColumns: ColumnDef<PedidoDataTable>[] = [
  {header: 'ID',
    accessorKey: 'id'
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
        {formatFecha(cell.row.original.fechaRecibido, "fechaHora")}
      </p>
    )
  },
  {
    header: "Ordenes de Compra",
    accessorKey: "ordenCompra"
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