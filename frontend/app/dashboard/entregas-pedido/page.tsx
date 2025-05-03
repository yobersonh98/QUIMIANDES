import TableEntregas from "@/components/entregas/lista-entregas";
import { ListarEntregaModel } from "@/services/entrega-pedido/models/listar-entregas-model";
import { PageProps } from "@/types/pagination";

export default async function EntregasPedidoPage(
  { searchParams }: PageProps<ListarEntregaModel>
) {
  const params = await searchParams

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center flex-row justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Entregas</h2>
        <div className="flex items-center space-x-2">
        </div>
      </div>

      <TableEntregas
          {...params}
        />
    </div>
  )

}