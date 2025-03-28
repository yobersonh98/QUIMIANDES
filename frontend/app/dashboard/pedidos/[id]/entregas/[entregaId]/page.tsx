import { DeliveryDetails } from "@/components/pedidos/delivery-details"
import BackButtonLayout from "@/components/shared/back-button-layout"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Printer } from "lucide-react"
import Link from "next/link"

// Datos de ejemplo para las entregas
const exampleDeliveries = [
  {
    id: "delivery-1",
    date: "25-dic-2023",
    vehicleInternal: "Camión #123",
    deliveredBy: "Juan Pérez",
    deliveryLocationId: "loc-001",
    deliveryLocationName: "Planta Porfice, Cúcuta",
    deliveryType: "Entrega al Cliente",
    remission: "REM-001",
    observations: "Entrega realizada sin novedad",
    products: [
      {
        productId: "PC-001.1",
        productName: "PHCA-20",
        presentation: "Granel",
        quantity: 20000,
        observations: "Producto entregado en buenas condiciones",
      },
      {
        productId: "PC-001.5",
        productName: "Acido Clorhidrico",
        presentation: "Granel",
        quantity: 3000,
        observations: "Entrega parcial según acuerdo con el cliente",
      },
    ],
  },
  {
    id: "delivery-2",
    date: "28-dic-2023",
    vehicleExternal: "Placa ABC-123",
    deliveredBy: "Carlos Rodríguez",
    deliveryLocationId: "loc-002",
    deliveryLocationName: "Planta Quimandes, Cúcuta",
    deliveryType: "Recoge en Planta",
    remission: "REM-002",
    products: [
      {
        productId: "PC-001.2",
        productName: "PAC-19",
        presentation: "Caneca 250kg",
        quantity: 15,
        observations: "",
      },
    ],
  },
  {
    id: "delivery-3",
    date: "02-ene-2024",
    vehicleInternal: "Camión #456",
    deliveredBy: "María López",
    deliveryLocationId: "loc-003",
    deliveryLocationName: "Planta Tonchala, Tonchala",
    deliveryType: "Entrega al Cliente",
    remission: "REM-003",
    observations: "Cliente solicitó entrega urgente",
    products: [
      {
        productId: "PC-001.3",
        productName: "Cloro Gaseoso",
        presentation: "Contenedor",
        quantity: 5,
        observations: "Entrega completa",
      },
      {
        productId: "PC-001.4",
        productName: "Soda Caustica",
        presentation: "Granel",
        quantity: 5000,
        observations: "Entrega completa según orden de compra",
      },
    ],
  },
]

// Datos de ejemplo para el pedido
const orderData = {
  id: "PC-001",
  client: {
    name: "Aguas kapital",
    document: "901234567-8",
  },
}

export default function DeliveryDetailsPage({ params }: { params: { id: string; entregaId: string } }) {
  // En producción, estos datos vendrían de la base de datos
  const delivery = exampleDeliveries.find((d) => d.id === params.entregaId)

  if (!delivery) {
    return (
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/dashboard/pedidos/${params.id}/gestionar`}>
                  <ChevronLeft className="h-4 w-4" />
                  Volver a Gestión de Entregas
                </Link>
              </Button>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Entrega no encontrada</h2>
          </div>
        </div>
        <div className="text-center p-10">
          <p>La entrega solicitada no existe o ha sido eliminada.</p>
        </div>
      </div>
    )
  }

  return (
    <BackButtonLayout title={<div className="flex items-center justify-between w-full">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Detalles de Entrega - Remisión {delivery.remission || "Sin remisión"}
          </h2>
        </div>
        <Button className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Imprimir Remisión
        </Button>
      </div>}>
      <div className="flex-1 space-y-6 p-8 pt-6">
      

      <DeliveryDetails delivery={delivery} orderData={orderData} />
    </div>
    </BackButtonLayout>
  )
}

