import * as React from "react";
import { Column } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  isSearchParam?: boolean; // si es true se va a usar como parametro de busqueda en la url
  keyToVariant?: keyof TData;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  allSearchsParams: string[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  isSearchParam,
  keyToVariant,
  allSearchsParams
}: DataTableFacetedFilterProps<TData, TValue>) {
  const { handleUpdateSearchParams } = useUpdateSearchParams({ searchParamsInPage: allSearchsParams });
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor="fecha-inicio" className="text-xs text-muted-foreground">
        {title}
      </label>
      <Select onValueChange={(value) => {
        if (isSearchParam) {
          handleUpdateSearchParams([{ key: keyToVariant?.toString() ?? "", value }])
        } else {
          column?.setFilterValue(value)
        }
      }}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={`Seleccione ${title}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{title}</SelectLabel>
            {options.map((option) => {
              return (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}