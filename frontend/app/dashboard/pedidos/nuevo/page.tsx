import { OrderForm } from "@/components/orders/order-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function NewOrderPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Link href="/dashboard/pedidos">
                <ChevronLeft className="h-4 w-4" />
                Volver
              </Link>
            </Button>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Nuevo Pedido</h2>
        </div>
      </div>
      <div className="grid gap-6">
        <OrderForm />
      </div>
    </div>
  )
}

