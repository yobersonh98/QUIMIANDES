import { OrderForm } from "@/components/orders/order-form"
import BackButtonLayout from "@/components/shared/back-button-layout"

export default function NewOrderPage() {
  return (
    <BackButtonLayout title="Nuevo Pedido">
      <OrderForm />
    </BackButtonLayout>
  )
}

