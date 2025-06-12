// src/modules/user/components/user-list.tsx
import { DataTable } from "@/components/data_table/data_table";
import { UserService } from "@/services/usuario/usuario.service";
import { PaginationSearchParamsPage } from "@/types/pagination";
import React from "react";
import { UserColumns } from "./user-columns";

type Props = {
  pagination?: PaginationSearchParamsPage;
};

export default async function ListarUsuarios({ pagination }: Props) {
  const { data, error } = await UserService.getServerInstance().listar(
    pagination
  );

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
        <p>Ocurrió un error al cargar los usuarios</p>
        <p className="text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <DataTable
      data={data?.data || []}
      columns={UserColumns}
      pagination={data?.meta}
      isShowSearchInput
    />
  );
}