import { OrdersTable } from "@/components/orders/order-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function OrdersPage() {
  return (
    <div className="flex-1 space-y-4 pt-6">
      <div className="flex items-center flex-row justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Pedidos</h2>
        <div className="flex items-center space-x-2">
        <Link href="/dashboard/pedidos/nuevo" passHref>
          <Button >
              <Plus className="mr-2 h-4 w-4" /> Nuevo Pedido
          </Button>
          </Link>
        </div>
      </div>
      <OrdersTable />
    </div>
  )
}

