import PedidoInfoBasica from "@/components/pedidos/pedido-info-basica"
import TableDetallesPedidos from "@/components/pedidos/table-detalles-pedido"
import BackButtonLayout from "@/components/shared/back-button-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PedidoService } from "@/services/pedidos/pedido.service"
import { PageProps, PaginationSearchParamsPage } from "@/types/pagination"
import { Pencil } from "lucide-react"
import Link from "next/link"

export default async function ListaPedidosPage(props: PageProps<PaginationSearchParamsPage>) {
  const params = await props.params;
  const respones = await PedidoService.getServerIntance().consultar(params?.id || '');
  if (!respones.data) {
    return <div>
      {respones.error?.message || 'No se econtro el pedido...'}
    </div>
  }
  const pedido = respones.data;
  return (
    <BackButtonLayout title={
      <div className="flex items-center w-full justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Pedido {respones.data?.codigo}</h2>
        </div>
        <Link href={`/dashboard/pedidos/${params?.id}/editar`}>
        <Button className="gap-2 flex">
          <Pencil className="h-4 w-4 mr-2" />
            Editar Pedido
        </Button>
        </Link>

      </div>}>
      <div className="flex flex-col space-y-4 ">
        <PedidoInfoBasica
          pedido={pedido}
        />
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Productos</CardTitle>
          </CardHeader>
          <CardContent>
            {/* aqui va el componente hijo */}
            <TableDetallesPedidos
              detallesPedidos={pedido.detallesPedido}
            />
          </CardContent>
        </Card>

        {pedido.observaciones && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{pedido.observaciones}</p>
            </CardContent>
          </Card>
        )}
      </div>
      </BackButtonLayout>
  )
}
