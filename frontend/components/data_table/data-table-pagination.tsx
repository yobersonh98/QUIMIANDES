import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { PaginationResponse, SearchParamToNavigation } from "@/lib/pagination";
import { useCallback } from "react";

import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";
import { PaginationMetadata, SearchParamToNavigation } from "@/types/pagination";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pagination?: PaginationMetadata;
  allSearchsParams: string[];
}

export function DataTablePagination<TData>({
  table,
  pagination,
  allSearchsParams
}: DataTablePaginationProps<TData>) {
  const { handleUpdateSearchParams, getValueToSearchParam } = useUpdateSearchParams({ searchParamsInPage: allSearchsParams });

  const handlePageChange = useCallback(
    (pageUrl: SearchParamToNavigation | null) => {
      if (pageUrl) {
        handleUpdateSearchParams([
          { key: "limit", value: pageUrl.limit.toString() },
          { key: "offset", value: pageUrl.offset.toString() },
        ]);
      }
    },
    [handleUpdateSearchParams]
  );

  const handlePageSizeChange = useCallback(
    (value: string) => {
      handleUpdateSearchParams([{ key: "limit", value }]);
    },
    [handleUpdateSearchParams]
  );
  
  const size = getValueToSearchParam("limit") || "10";
  if (!pagination) {
    return null;
  }
  const {
    nextPage,
    backPage,
    lastPage,
    totalPages,
    currentPage,
    firstPage,
    totalItems,
  } = pagination;


  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {totalItems > 0 && (
          <>
            <p className="hidden sm:block">
              {size} de {totalItems} filas
            </p>
            <p className="sm:hidden">
              {size} / {totalItems}
            </p></>
        )}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Filas
          </p>
          <Select value={`${size}`} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50, 100, 250, 10000].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {currentPage} / {totalPages}
        </div>
        <div style={{ margin: 0 }} className="flex items-center mx-0 gap-2 sm:space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(firstPage)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(backPage)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(nextPage)}
            disabled={!nextPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(lastPage)}
            disabled={!currentPage || currentPage === totalPages || !lastPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
