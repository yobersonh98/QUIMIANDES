"use client"

import { Button } from "@/components/ui/button";
import { ClienteEntity } from "@/services/clientes/entities/cliente.entity";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";

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
          <div className="flex space-x-2">
            <Button size={"icon"} variant={"secondary"}
              title="Ver Cliente"
            >
              <Link href={`/dashboard/clientes/${cell.row.original.id}`}>
                <Eye size={18} />
              </Link>
            </Button>
            <Button size={"icon"}
            
              title="Editar Cliente">
                <Link href={`/dashboard/clientes/${cell.row.original.id}/editar`}>
                  <Pencil size={18} />
                </Link>
            </Button>
          </div>
        );
      }
    }

]