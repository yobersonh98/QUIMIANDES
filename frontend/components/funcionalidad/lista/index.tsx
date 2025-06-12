
import { DataTable } from "@/components/data_table/data_table";
import { PaginationSearchParamsPage } from "@/types/pagination";
import React from "react";
import { FuncionalidadColumns } from "./funcionalidad-columns";
import { FuncionalidadService } from "@/services/funcionalidad/funcionalidad.service";

type Props = {
  pagination?: PaginationSearchParamsPage;
};

export default async function ListaFuncionalidades({ pagination }: Props) {
  const { data, error } = await FuncionalidadService.getServerInstance().listar(
    pagination
  );

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
        <p>Ocurrió un error al cargar las funcionalidades</p>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <DataTable
      data={data?.data || []}
      columns={FuncionalidadColumns}
      pagination={data?.meta}
      isShowSearchInput
    />
  );
}