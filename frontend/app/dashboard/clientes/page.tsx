import { ClientModal } from "@/components/client-modal";
import { ClientsTable } from "@/components/clients-table";

export default function ClientsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
        <div className="flex items-center space-x-2">
          <ClientModal />
        </div>
      </div>
      <ClientsTable />
    </div>
  )
}

