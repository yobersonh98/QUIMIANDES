// src/modules/user/components/user-columns.tsx
"use client"
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
// import { ActionsDropdown } from "./user-actions-dropdown";
import { UserEntity } from "@/services/usuario/entity/user.entity";
import { UsuarioActionsDropdown } from "./usuario-actions";

export const UserColumns: ColumnDef<UserEntity>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.getValue("name") || "-"}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("email")}
      </span>
    ),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => (
      <Badge variant={row.getValue("estado") ? "default" : "destructive"}>
        {row.getValue("estado") ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "Creado",
  //   cell: ({ row }) => (
  //     <span className="text-muted-foreground">
  //       {format(new Date(row.getValue("createdAt")), "PP", { locale: es })}
  //     </span>
  //   ),
  // },
  // {
  //   accessorKey: "updatedAt",
  //   header: "Actualizado",
  //   cell: ({ row }) => (
  //     <span className="text-muted-foreground">
  //       {format(new Date(row.getValue("updatedAt")), "PP", { locale: es })}
  //     </span>
  //   ),
  // },
  {
    id: "actions",
    header: "Acciones",
   cell: ({ row }) => <UsuarioActionsDropdown usuario={row.original} />,
  },
];