"use client"

import { Button } from "@/components/ui/button";
import { ClienteEntity } from "@/services/clientes/entities/cliente.entity";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash } from "lucide-react";

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
      cell: (row) => {
        return (
          <div className="flex space-x-2">
            <Button size={"icon"} variant={"destructive"}>
              <Trash />
            </Button>
            <Button size={"icon"}>
              <Eye />
            </Button>
            <Button size={"icon"}>
              <Pencil />
            </Button>
          </div>
        );
      }
    }

]