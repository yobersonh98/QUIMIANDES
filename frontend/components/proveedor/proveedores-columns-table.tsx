"use client"

import { Button } from "@/components/ui/button";
import { ProveedorEntity } from "@/services/proveedor/entities/proveedor.entity";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";
import { ModificarProveedorModal } from "./modificar-proveedo-modal";

export const ProveedoresColumns: ColumnDef<ProveedorEntity>[] = [
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
    header: "Acciones",
    accessorKey: "id",
    cell: (cell) => {
      return (
        <div className="flex space-x-2">
          <Link href={`/dashboard/proveedores/${cell.row.original.id}`} passHref>
            <Button size={"icon"} variant={"secondary"}
              title="Ver Cliente"
            >
              <Eye size={18} />
            </Button>
          </Link>
          <ModificarProveedorModal 
            proveedor={cell.row.original}
          />
        </div>
      );
    }
  }

]