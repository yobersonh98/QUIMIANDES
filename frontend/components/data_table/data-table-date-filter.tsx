import useUpdateSearchParams from "@/hooks/useUpdateSearchParams"
import { Input } from "../ui/input"
import { Table } from "@tanstack/react-table"

// 2. Tipo para configuración de filtros de fecha
export type DateFiltersConfig<TData> = {
  startDateKey?: keyof TData
  endDateKey?: keyof TData
  showDateFilters?: boolean
  isSearchParam?: boolean // Similar a ColumnToVariantFilter
  startDateLabel?: string
  endDateLabel?: string
}



// 3. Componente de filtros de fecha para DataTableToolbar
export function DataTableDateFilters<TData>({ 
  table,
  dateFilters,
}: { 
  table: Table<TData>
  dateFilters: DateFiltersConfig<TData>
  allSearchsParams: string[]
}) {
  const { handleUpdateSearchParams, deleteSarchParam } = useUpdateSearchParams({ searchParamsInPage: [] })
  
  const {
    startDateKey,
    endDateKey,
    isSearchParam = false,
    startDateLabel = "Fecha inicio",
    endDateLabel = "Fecha fin"
  } = dateFilters

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    
    if (isSearchParam) {
      // Manejar como search param (similar a los variant filters)
      if (value === "") {
        deleteSarchParam("initDate")
      } else {
        handleUpdateSearchParams([{ key: "initDate", value }])
      }
    } else {
      // Manejar como filtro local de la tabla
      if (startDateKey) {
        const column = table.getColumn(startDateKey.toString())
        if (column) {
          column.setFilterValue(value || undefined)
        }
      }
    }
  }

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    
    if (isSearchParam) {
      // Manejar como search param
      if (value === "") {
        deleteSarchParam("endDate")
      } else {
        handleUpdateSearchParams([{ key: "endDate", value }])
      }
    } else {
      // Manejar como filtro local de la tabla
      if (endDateKey) {
        const column = table.getColumn(endDateKey.toString())
        if (column) {
          column.setFilterValue(value || undefined)
        }
      }
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex flex-col space-y-1">
        <label htmlFor="fecha-inicio" className="text-xs text-muted-foreground">
          {startDateLabel}
        </label>
        <Input
          id="fecha-inicio"
          type="date"
          onChange={handleStartDateChange}
          className="h-8 md:w-[150px]"
          placeholder={startDateLabel}
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="fecha-fin" className="text-xs text-muted-foreground">
          {endDateLabel}
        </label>
        <Input
          id="fecha-fin"
          type="date"
          onChange={handleEndDateChange}
          className="h-8 md:w-[150px]"
          placeholder={endDateLabel}
        />
      </div>
    </div>
  )
}
