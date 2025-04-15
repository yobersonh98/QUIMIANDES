"use client";

import { Cross } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Variants } from "@/types/data-table";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";

export type ColumnToVariantFilter<TData> = {
  keyToVariant: keyof TData;
  title: string;
  variants: Variants[];
  isSearchParam?: boolean; // si es true se va a usar como parametro de busqueda en la url
};
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  keyToFilter?: keyof TData;
  columnToVariantFilter?: ColumnToVariantFilter<TData>;
  allSearchsParams: string[]; 
  isShowSearchInput?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  columnToVariantFilter,
  allSearchsParams,
  isShowSearchInput
}: DataTableToolbarProps<TData>) {
  const {handleUpdateSearchParams, deleteSarchParam} = useUpdateSearchParams({searchParamsInPage:[]})
  const isFiltered = table.getState().columnFilters.length > 0;
  const { keyToVariant, title, variants } = columnToVariantFilter || {
    title: "",
    variants: [],
    isSearchParam: false,
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {
          isShowSearchInput && (<Input
            placeholder={`Buscar `}
            onChange={(event) =>
              debounce(() => {
                const value = event.target.value
                if(value === "") return deleteSarchParam("search");
                handleUpdateSearchParams([{key:"search", value}])
              }, 500)()
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />)
        }
        {keyToVariant &&
          table.getColumn(keyToVariant && keyToVariant.toString()) && (
            <DataTableFacetedFilter
              column={table.getColumn(keyToVariant.toString())}
              title={title}
              keyToVariant={keyToVariant}
              isSearchParam={columnToVariantFilter?.isSearchParam}
              allSearchsParams={allSearchsParams} 
              options={variants}
            />
          )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpiar
            <Cross className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
