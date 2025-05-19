"use client"

import { DataTable } from "../data_table/data_table"
import { PedidoColumns } from "./table-pedidos-columns"
import { PedidoDetalleExpandido } from "./pedido-detalle-expandido"
import type { Row } from "@tanstack/react-table"
import type { PedidoDataTable } from "@/services/pedidos/entity/pedido.entity"
import type { PaginationMetadata } from "@/types/pagination"

interface ClientTablePedidosProps {
  data: PedidoDataTable[]
  pagination?: PaginationMetadata
}

export function ClientTablePedidos({ data, pagination }: ClientTablePedidosProps) {
  // Verifica los datos recibidos

  const renderSubComponent = ({ row }: { row: Row<PedidoDataTable> }) => {
    const detalles = row.original.detallesPedido || [];
    
    return <PedidoDetalleExpandido detallesPedido={detalles} />
  }

  // Función para determinar si una fila puede expandirse
  const getRowCanExpand = (row: Row<PedidoDataTable>) => {
    return !!row.original.detallesPedido && row.original.detallesPedido.length > 0
  }

  return (
    <DataTable
      columns={PedidoColumns}
      data={data}
      isShowSearchInput={true}
      pagination={pagination}
      renderSubComponent={renderSubComponent}
      getRowCanExpand={getRowCanExpand}
      columnToVariantFilter={{
        keyToVariant: "estado",
        isSearchParam: true,
        title: "Estado",
        variants: [
          { value: "TODOS", label: "Todos" },
          { value: "PENDIENTE", label: "Pendiente" },
          { value: "ENTREGADO", label: "Entregado" },
          { value: "EN_PROCESO", label: "En proceso" },
          { value: "CANCELADO", label: "Cancelado" },
        ],
      }}
    />
  )
}