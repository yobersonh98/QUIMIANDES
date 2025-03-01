import { CrearProveedorModal } from "@/components/proveedor/crear-proveedor-modal";
import ListaProveedores from "@/components/proveedor/lista-proveedores";
import { ProveedorService } from "@/services/proveedor/provedor.service";
import { PageProps, PaginationSearchParamsPage } from "@/types/pagination";

export default async function ProveedoresPage(props: PageProps<PaginationSearchParamsPage>) {
  const searchParams = await props?.searchParams as PaginationSearchParamsPage;
  const { data } = await ProveedorService.getServerInstance().listar(searchParams);
  if (!data) {
    return <div>No se encontro ningun proveedor</div>
  }
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Proveedores</h1>
        <CrearProveedorModal

        />
      </div>
      <ListaProveedores
        pagination={data.meta}
        proveedores={data.data}
      />
    </div>
  )
}