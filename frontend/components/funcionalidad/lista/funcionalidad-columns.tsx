// src/modules/funcionalidad/components/funcionalidad-columns.tsx
"use client"
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FuncionalidadEntity } from "@/services/funcionalidad/entity/funcionalidad.entity";
import { ActionsDropdown } from "./funcionalidad-actions-dropdown";

export const FuncionalidadColumns: ColumnDef<FuncionalidadEntity>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.icon && (
          <span className="text-lg">{row.original.icon}</span>
        )}
        <span>{row.getValue("nombre")}</span>
      </div>
    ),
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("descripcion") || "-"}
      </span>
    ),
  },
  {
    accessorKey: "ruta",
    header: "Ruta",
    cell: ({ row }) => (
      <code className="text-sm">
        {row.getValue("ruta") || "-"}
      </code>
    ),
  },
  {
    accessorKey: "activo",
    header: "Estado",
    cell: ({ row }) => (
      <Badge variant={row.getValue("activo") ? "default" : "destructive"}>
        {row.getValue("activo") ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
  {
    accessorKey: "creadoEn",
    header: "Creado",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {format(new Date(row.getValue("creadoEn")), "PP", { locale: es })}
      </span>
    ),
  },
  {
    id: "actions",
    header: 'Acciones',
    cell: ({ row }) => <ActionsDropdown funcionalidad={row.original} />,
  },
];