// src/modules/funcionalidad/components/funcionalidad-actions-dropdown.tsx

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ToggleActivoFuncionalidad } from "../toggle-activo-funcionalidad";
import { EliminarFuncionalidad } from "../eliiminar-funcionalidad";
import { FuncionalidadEntity } from "@/services/funcionalidad/entity/funcionalidad.entity";
import ToggleFormFuncionalidad from "../toggle-form-funcionalidad";

export function ActionsDropdown({
  funcionalidad,
}: {
  funcionalidad: FuncionalidadEntity;
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
          <ToggleFormFuncionalidad
            variant="ghost"
      className="w-full justify-start"
      text="Editar"
          funcionalidad={funcionalidad}>
          </ToggleFormFuncionalidad>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <ToggleActivoFuncionalidad
            id={funcionalidad.id}
            currentState={funcionalidad.activo}
          />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <EliminarFuncionalidad id={funcionalidad.id} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}