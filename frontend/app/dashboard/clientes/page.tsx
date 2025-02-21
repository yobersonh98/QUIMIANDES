import { ClientModal } from "@/components/clientes/client-modal";
import { ClientsTable } from "@/components/clientes/clients-table";
import { ClienteService } from "@/services/clientes/clientes.service";

export default  async function ClientsPage() {
  const clientes = await  ClienteService.getInstance().listar();
  console.log(clientes);
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

