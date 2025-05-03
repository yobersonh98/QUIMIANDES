"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getExpandedRowModel,
} from "@tanstack/react-table"
import { ChevronDown, ChevronRight, Eye, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import EstadoBadge from "../shared/estado-badge"

// Tipos de datos actualizados
export type OrderProduct = {
  subId: string
  productName: string
  requirementDate: string
  presentation: string
  unit: number
  quantity: number
  dispatchedQuantity: number
  total: number
  receivedWeight: number
  deliveryType: string
  deliveryLocation: string
  city: string
  deliveryDate?: string
}

export type Order = {
  id: string
  orderDate: string
  requirementDate: string
  client: string
  productsCount: number
  products: OrderProduct[]
  totalWeight: number
  totalValue: number
  status: string
  purchaseOrder: string
  observations?: string
}

// Datos de ejemplo actualizados
const data: Order[] = [
  {
    id: "PC-001",
    orderDate: "20-dic",
    requirementDate: "Diferentes Fechas",
    client: "Aguas kapital",
    productsCount: 5,
    products: [
      {
        subId: "PC-001.1",
        productName: "PHCA-20",
        requirementDate: "29-dic",
        presentation: "Granel",
        unit: 1,
        quantity: 34000,
        dispatchedQuantity: 34000,
        total: 34000,
        receivedWeight: 34000,
        deliveryType: "Entrega al Cliente",
        deliveryLocation: "Planta Porfice",
        city: "Cúcuta",
      },
      {
        subId: "PC-001.2",
        productName: "PAC-19",
        requirementDate: "30-dic",
        presentation: "Caneca 250kg",
        unit: 250,
        quantity: 20,
        dispatchedQuantity: 5000,
        total: 5000,
        receivedWeight: 5000,
        deliveryType: "Recoge en Planta",
        deliveryLocation: "Planta Quimandes",
        city: "Cúcuta",
      },
      {
        subId: "PC-001.3",
        productName: "Cloro Gaseoso",
        requirementDate: "31-dic",
        presentation: "Contenedor",
        unit: 900,
        quantity: 5,
        dispatchedQuantity: 4500,
        total: 4500,
        receivedWeight: 4500,
        deliveryType: "Entrega al Cliente",
        deliveryLocation: "Planta Tonchala",
        city: "Tonchala",
      },
      {
        subId: "PC-001.4",
        productName: "Soda Caustica",
        requirementDate: "01-ene",
        presentation: "Granel",
        unit: 1,
        quantity: 5000,
        dispatchedQuantity: 5000,
        total: 5000,
        receivedWeight: 5000,
        deliveryType: "Entrega al Cliente",
        deliveryLocation: "Planta Bocatoma",
        city: "Cúcuta",
      },
      {
        subId: "PC-001.5",
        productName: "Acido Clorhidrico",
        requirementDate: "02-ene",
        presentation: "Granel",
        unit: 1,
        quantity: 5000,
        dispatchedQuantity: 5000,
        total: 5000,
        receivedWeight: 5000,
        deliveryType: "Entrega al Cliente",
        deliveryLocation: "Planta Porfice",
        city: "Cúcuta",
      },
    ],
    totalWeight: 53500,
    totalValue: 121960000,
    status: "Entregado Parcialmente",
    purchaseOrder: "OC-010931",
  },
  {
    id: "PC-002",
    orderDate: "22-dic",
    requirementDate: "30-dic",
    client: "TQI",
    productsCount: 3,
    products: [
      {
        subId: "PC-002.1",
        productName: "Sulfato de Aluminio",
        requirementDate: "30-dic",
        presentation: "Granel",
        unit: 1,
        quantity: 15000,
        dispatchedQuantity: 15000,
        total: 15000,
        receivedWeight: 15000,
        deliveryType: "Entrega al Cliente",
        deliveryLocation: "Planta Principal",
        city: "Bucaramanga",
      },
      {
        subId: "PC-002.2",
        productName: "Hipoclorito de Sodio",
        requirementDate: "30-dic",
        presentation: "Contenedor",
        unit: 1000,
        quantity: 10,
        dispatchedQuantity: 10000,
        total: 10000,
        receivedWeight: 10000,
        deliveryType: "Entrega al Cliente",
        deliveryLocation: "Planta Principal",
        city: "Bucaramanga",
      },
      {
        subId: "PC-002.3",
        productName: "Cal Hidratada",
        requirementDate: "30-dic",
        presentation: "Saco 25kg",
        unit: 25,
        quantity: 200,
        dispatchedQuantity: 5000,
        total: 5000,
        receivedWeight: 5000,
        deliveryType: "Recoge en Planta",
        deliveryLocation: "Planta Quimandes",
        city: "Cúcuta",
      },
    ],
    totalWeight: 30000,
    totalValue: 75000000,
    status: "Pendiente",
    purchaseOrder: "OC-010932",
  },
]

export const columns: ColumnDef<Order>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <Button variant="ghost" onClick={row.getToggleExpandedHandler()} className="p-0 w-6 h-6">
          {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      ) : null
    },
  },
  {
    accessorKey: "id",
    header: "ID del Pedido",
    cell: ({ row }) => {
      if (row.original.id) {
        return <span className="text-muted-foreground">{row.original.id}</span>
      }
      return row.original.id
    },
  },
  {
    accessorKey: "orderDate",
    header: "Fecha del Pedido",
  },
  {
    accessorKey: "client",
    header: "Cliente",
  },
  {
    accessorKey: "productName",
    header: "Producto",
    cell: ({ row }) => {
      if (row.depth === 0) {
        return <Badge variant="outline">{row.original.productsCount}</Badge>
      }
      return row.original.products
    },
  },
  {
    accessorKey: "status",
    header: "Estado del Pedido",
    cell: ({ row }) => {
      if (row.depth > 0) return null
      const status = row.original.status
      return <EstadoBadge estado={status} />
    },
  },
  {
    accessorKey: "purchaseOrder",
    header: "Orden de Compra",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      
      const order = row.original

      // Solo mostrar acciones para filas principales
      if (row.depth > 0) return null

      return (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" >
            <Link href={`/dashboard/pedidos/${order.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Link href={`/dashboard/pedidos/${order.id}/editar`}>
              <Pencil className="h-4 w-4 mr-1" />
              Editar
            </Link>
          </Button>
        </div>
      )
    },
  },
]

export function OrdersTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [expanded, setExpanded] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
    // getSubRows: (row) =>
    //   row.products?.map((product) => ({
    //     ...product,
    //     orderDate: row.orderDate,
    //     client: "",
    //     productsCount: null,
    //     totalWeight: null,
    //     totalValue: null,
    //     status: "",
    //     purchaseOrder: "",
    //   })),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filtrar por ID..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("id")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Input
          placeholder="Filtrar por cliente..."
          value={(table.getColumn("client")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("client")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={row.depth > 0 ? "bg-muted/50" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} fila(s)
          seleccionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}

