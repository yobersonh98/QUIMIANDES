"use client"
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { AuditoriaLogEntity, NivelAuditoria, TipoOperacion } from "@/services/auditoria/entities/AuditoriaEntity";

// Función para obtener el color del badge según el tipo de operación
const getTipoOperacionColor = (tipo: TipoOperacion) => {
  switch (tipo) {
    case "CREAR":
      return "bg-green-100 text-green-800 border-green-200";
    case "ACTUALIZAR":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "ELIMINAR":
      return "bg-red-100 text-red-800 border-red-200";
    case "INICIAR_SESION":
    case "CERRAR_SESION":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "VER":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "EXPORTAR":
    case "IMPORTAR":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "APROBAR":
    case "ACTIVAR":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "RECHAZAR":
    case "CANCELAR":
    case "DESACTIVAR":
      return "bg-rose-100 text-rose-800 border-rose-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Función para obtener el color del badge según el nivel
const getNivelColor = (nivel: NivelAuditoria) => {
  switch (nivel) {
    case "INFO":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "ADVERTENCIA":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "ERROR":
      return "bg-red-100 text-red-800 border-red-200";
    case "CRITICO":
      return "bg-red-500 text-white border-red-600";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const AuditoriaColumns: ColumnDef<AuditoriaLogEntity>[] = [
  {
    header: "Fecha",
    accessorKey: "fechaHora",
    cell: (cell) => {
      const fecha = cell.getValue() as string;
      return fecha ? new Date(fecha).toLocaleString('es-CO') : '-';
    }
  },
  {
    header: "Usuario",
    accessorKey: "usuario",
    cell: (cell) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {cell.row.original.usuario?.name || 'Sistema'}
        </span>
        <span className="text-sm text-gray-500">
          {cell.row.original.usuario?.email || '-'}
        </span>
      </div>
    )
  },
  {
    header: "Operación",
    accessorKey: "tipoOperacion",
    cell: (cell) => {
      const tipo = cell.getValue() as TipoOperacion;
      return (
        <Badge 
          variant="outline" 
          className={getTipoOperacionColor(tipo)}
        >
          {tipo.replace('_', ' ')}
        </Badge>
      );
    }
  },
  {
    header: "Entidad",
    accessorKey: "entidad",
    cell: (cell) => (
      <div className="flex flex-col">
        <span className="font-medium">{cell.getValue() as string}</span>
        {cell.row.original.entidadId && (
          <span className="text-xs text-gray-500">
            ID: {cell.row.original.entidadId}
          </span>
        )}
      </div>
    )
  },
  {
    header: "Módulo",
    accessorKey: "modulo",
    cell: (cell) => (
      <div className="flex flex-col">
        <span>{cell.getValue() as string || '-'}</span>
        {cell.row.original.accion && (
          <span className="text-sm text-gray-500">
            {cell.row.original.accion}
          </span>
        )}
      </div>
    )
  },
  {
    header: "Nivel",
    accessorKey: "nivel",
    cell: (cell) => {
      const nivel = cell.getValue() as NivelAuditoria;
      if (!nivel) return '-';
      
      return (
        <Badge 
          variant="outline" 
          className={getNivelColor(nivel)}
        >
          {nivel}
        </Badge>
      );
    }
  },
  {
    header: "Descripción",
    accessorKey: "descripcion",
    cell: (cell) => (
      <div className="max-w-xs">
        <p className="truncate" title={cell.getValue() as string}>
          {cell.getValue() as string}
        </p>
      </div>
    )
  },
  // {
  //   header: "IP",
  //   accessorKey: "ipAddress",
  //   cell: (cell) => (
  //     <span className="text-sm font-mono">
  //       {cell.getValue() as string || '-'}
  //     </span>
  //   )
  // }
];