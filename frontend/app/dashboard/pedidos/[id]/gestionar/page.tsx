import { OrderDeliveryManager } from "@/components/pedidos/pedido-delivery-manager"
import BackButtonLayout from "@/components/shared/back-button-layout"
import { Button } from "@/components/ui/button";
import { PedidoService } from "@/services/pedidos/pedido.service";
import { PageProps, PaginationSearchParamsPage } from "@/types/pagination"
import { Plus } from "lucide-react";
import Link from "next/link";

// En producción, estos datos vendrían de la base de datos
const orderData = {
  id: "PC-001",
  orderDate: "20-dic",
  client: {
    id: "client-001",
    name: "Aguas kapital",
    document: "901234567-8",
  },
  requirementDate: "Diferentes Fechas",
  status: "En entrega",
  purchaseOrder: "OC-010931",
  totalWeight: 53500,
  totalValue: 121960000,
  products: [
    {
      id: "PC-001.1",
      name: "PHCA-20",
      requirementDate: "29-dic",
      presentation: "Granel",
      unit: 1,
      quantity: 34000,
      dispatchedQuantity: 0,
      total: 34000,
      receivedWeight: 0,
      deliveryType: "Entrega al Cliente",
      deliveryLocation: {
        id: "loc-001",
        name: "Planta Porfice",
        city: "Cúcuta",
      },
      deliveryStatus: "Pendiente",
    },
    {
      id: "PC-001.2",
      name: "PAC-19",
      requirementDate: "30-dic",
      presentation: "Caneca 250kg",
      unit: 250,
      quantity: 20,
      dispatchedQuantity: 0,
      total: 5000,
      receivedWeight: 0,
      deliveryType: "Recoge en Planta",
      deliveryLocation: {
        id: "loc-002",
        name: "Planta Quimandes",
        city: "Cúcuta",
      },
      deliveryStatus: "Pendiente",
    },
    {
      id: "PC-001.3",
      name: "Cloro Gaseoso",
      requirementDate: "31-dic",
      presentation: "Contenedor",
      unit: 900,
      quantity: 5,
      dispatchedQuantity: 0,
      total: 4500,
      receivedWeight: 0,
      deliveryType: "Entrega al Cliente",
      deliveryLocation: {
        id: "loc-003",
        name: "Planta Tonchala",
        city: "Tonchala",
      },
      deliveryStatus: "Pendiente",
    },
    {
      id: "PC-001.4",
      name: "Soda Caustica",
      requirementDate: "01-ene",
      presentation: "Granel",
      unit: 1,
      quantity: 5000,
      dispatchedQuantity: 0,
      total: 5000,
      receivedWeight: 0,
      deliveryType: "Entrega al Cliente",
      deliveryLocation: {
        id: "loc-004",
        name: "Planta Bocatoma",
        city: "Cúcuta",
      },
      deliveryStatus: "Pendiente",
    },
    {
      id: "PC-001.5",
      name: "Acido Clorhidrico",
      requirementDate: "02-ene",
      presentation: "Granel",
      unit: 1,
      quantity: 5000,
      dispatchedQuantity: 0,
      total: 5000,
      receivedWeight: 0,
      deliveryType: "Entrega al Cliente",
      deliveryLocation: {
        id: "loc-001",
        name: "Planta Porfice",
        city: "Cúcuta",
      },
      deliveryStatus: "Pendiente",
    },
  ],
  deliveries: [],
  observations: "Entrega en diferentes fechas según programación",
}

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
        <Link href={`/dashboard/pedidos/${params?.id}/gestionar/registrar-entrega`}>
          <Button>
            <Plus size={24} />
            Registrar Entrega
          </Button>
        </Link>
      </div>}>
      <OrderDeliveryManager initialData={orderData} pedido={respones.data} orderId={orderData.id} />
    </BackButtonLayout>
  )
}

