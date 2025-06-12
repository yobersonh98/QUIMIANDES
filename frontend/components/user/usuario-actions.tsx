// src/modules/user/components/usuario-actions-dropdown.tsx

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { UserEntity } from "@/services/usuario/entity/user.entity";
import ToggleFormUsuario from "./toggle-usuario-form";
import { ToggleActivoUsuario } from "./toggle-activo-usuario";
import { EliminarUsuario } from "./eliminar-usuario";

export function UsuarioActionsDropdown({
  usuario,
}: {
  usuario: UserEntity;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <ToggleFormUsuario
            variant="ghost"
            className="w-full justify-start"
            text="Editar"
            usuario={usuario}
          />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <ToggleActivoUsuario
            id={usuario.id}
            currentState={usuario.estado}
          />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <EliminarUsuario id={usuario.id} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}