"use client"
import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getExpandedRowModel,
  type ExpandedState,
  type Row
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { DataTablePagination } from "./data-table-pagination"
import { type ColumnToVariantFilter, DataTableToolbar } from "./data-table-toolbar"
import type { PaginationMetadata } from "@/types/pagination"
import { DateFiltersConfig } from "./data-table-date-filter"
import { useIsMobile } from "@/hooks/use-mobile"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  columnToVariantFilter?: ColumnToVariantFilter<TData>
  pagination?: PaginationMetadata
  allSearchsParams?: string[]
  isShowSearchInput?: boolean
  renderSubComponent?: (props: { row: Row<TData> }) => React.ReactNode
  getRowCanExpand?: (row: Row<TData>) => boolean
  dateFilters?: DateFiltersConfig<TData>
  // Nueva prop para controlar el formato responsivo
  enableStackedMobile?: boolean
}

// Componente para vista mobile stacked
function MobileStackedRow<TData,TValue>({ row, columns }: { row: Row<TData>, columns: ColumnDef<TData, TValue>[] }) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="space-y-3">
          {row.getVisibleCells().map((cell, index) => {
            const column = columns[index]
            const header = typeof column.header === 'string' 
              ? column.header 
              : column.id || `Column ${index + 1}`
            
            return (
              <div key={cell.id} className="flex justify-between items-start">
                <div className="font-medium text-sm text-muted-foreground min-w-0 flex-1 pr-3">
                  {header}
                </div>
                <div className="text-sm text-right min-w-0 flex-1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}


export function DataTable<TData, TValue>({
  columns,
  data,
  columnToVariantFilter,
  pagination,
  allSearchsParams = [],
  isShowSearchInput,
  renderSubComponent,
  getRowCanExpand,
  dateFilters,
  enableStackedMobile = true // Por defecto habilitado
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  // Detectar si estamos en mobile
  const isMobile = useIsMobile()

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      expanded,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand,
  })

  // Renderizado para mobile con cards stacked
  const renderMobileView = () => (
    <div className="space-y-4">
      <DataTableToolbar
        isShowSearchInput={isShowSearchInput}
        columnToVariantFilter={columnToVariantFilter}
        table={table}
        allSearchsParams={allSearchsParams}
        dateFilters={dateFilters}
      />
      
      <div className="space-y-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div key={row.id}>
              <MobileStackedRow row={row} columns={columns} />
              {row.getIsExpanded() && renderSubComponent && (
                <div className="ml-4 mb-4">
                  <Card>
                    <CardContent className="p-4 bg-muted/30">
                      {renderSubComponent({ row })}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No hay resultados...
            </CardContent>
          </Card>
        )}
      </div>
      
      <DataTablePagination 
        allSearchsParams={allSearchsParams} 
        pagination={pagination} 
        table={table} 
      />
    </div>
  )

  // Renderizado para desktop con tabla tradicional
  const renderDesktopView = () => (
    <div className="space-y-4">
      <DataTableToolbar
        isShowSearchInput={isShowSearchInput}
        columnToVariantFilter={columnToVariantFilter}
        table={table}
        allSearchsParams={allSearchsParams}
        dateFilters={dateFilters}
      />
      
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && renderSubComponent && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="p-0">
                        <div className="p-4 bg-muted/30">
                          {renderSubComponent({ row })}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <DataTablePagination 
        allSearchsParams={allSearchsParams} 
        pagination={pagination} 
        table={table} 
      />
    </div>
  )

  // Retornar la vista apropiada según el tamaño de pantalla
  return enableStackedMobile && isMobile ? renderMobileView() : renderDesktopView()
}
