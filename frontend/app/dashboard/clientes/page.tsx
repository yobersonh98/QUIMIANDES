import ClientesDataTable from "@/components/clientes/data-table/clientes-datatable";
import { Button } from "@/components/ui/button";
import { ClienteService } from "@/services/clientes/clientes.service";
import { PageProps, PaginationSearchParamsPage } from "@/types/pagination";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function ClientsPage(
  props: PageProps<PaginationSearchParamsPage>
) {
  const searchParams = await props.searchParams;
  const { data } = await ClienteService.getServerInstance().listar(
    searchParams
  );
  if (!data) {
    return <div>No se encontraron clientes</div>;
  }
  return (
    <div className="flex-1 space-y-4  pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
        <div className="flex items-center space-x-2">
          <Link href={"/dashboard/clientes/crear"}>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Nuevo Cliente
            </Button>
          </Link>
        </div>
      </div>
      <ClientesDataTable pagination={data.meta} clientes={data.data} />
    </div>
  );
}
