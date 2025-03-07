"use client"
import DataTableDefaultRowAcciones from "@/components/shared/data-table-default-acciones";
import { ProductoEntity } from "@/services/productos/entities/producto.entity";
import { ColumnDef } from "@tanstack/react-table";

export const ProductosColumns: ColumnDef<ProductoEntity>[] = [
  {
    header: "Nombre",
    accessorKey: "nombre",
  },
  {
    header: "Proveedor",
    accessorKey: "proveedor",
    cell: (cell) => (
      <div>
        {cell.row.original.proveedor?.nombre}
      </div>
    )
  },
  {
    header: "Presentación",
    accessorKey: "presentacion",
    cell: (cell) => (
      <div>
        {cell.row.original.presentacion?.nombre}
      </div>
    )
  },
  {
    header: "Unidad de Medida",
    accessorKey: "unidadMedida",
  },
  {
    header: "Precio",
    accessorKey: "precioBase"
  },
  {
    header: "Acciones",
    accessorKey: "id",
    cell: (cell) => {
      return (
        <DataTableDefaultRowAcciones 
          pathName={`/dashboard/productos/${cell.row.original.id}`}
          modifyPathName={`/dashboard/productos/${cell.row.original.id}/editar`}
        />
      );
    }
  }

]