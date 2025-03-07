"use client"

import DataTableDefaultRowAcciones from "@/components/shared/data-table-default-acciones";
import { ClienteEntity } from "@/services/clientes/entities/cliente.entity";
import { ColumnDef } from "@tanstack/react-table";

export const ClientesColumns: ColumnDef<ClienteEntity>[] = [
  {
    header: "Nombre",
    accessorKey: "nombre",
  },
  {
    header: "Documento",
    accessorKey: "documento",
  },
  {
    header: "Dirección",
    accessorKey: "direccion",
  },
  {
    header: "Teléfono",
    accessorKey: "telefono",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Acciones",
    accessorKey: "id",
    cell: (cell) => {
      return (
        <DataTableDefaultRowAcciones 
          pathName={`/dashboard/clientes/${cell.row.original.id}`}
          modifyPathName={`/dashboard/clientes/${cell.row.original.id}/editar
          `}
        />
      );
    }
  }

]