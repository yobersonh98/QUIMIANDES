import { OrderDeliveryManager } from "@/components/pedidos/pedido-delivery-manager"
import BackButtonLayout from "@/components/shared/back-button-layout"
import { PedidoService } from "@/services/pedidos/pedido.service";
import { PageProps, PaginationSearchParamsPage } from "@/types/pagination"

export default async function ManageOrderDeliveryPage(props: PageProps<PaginationSearchParamsPage>) {
  const params = await props.params;
  const respones = await PedidoService.getServerIntance().consultar(params?.id || '');
  if (!respones.data) {
    return <div>
      {respones.error?.message || 'No se econtro el pedido...'}
    </div>
  }

  return (
    <BackButtonLayout title={
      <div className="w-full flex justify-between items-center">
        <h2 className="m-0 p-0 text-xl text-center align-middle">
          Gestionar Pedido
        </h2>
      </div>}>
      <OrderDeliveryManager  pedido={respones.data} />
    </BackButtonLayout>
  )
}

