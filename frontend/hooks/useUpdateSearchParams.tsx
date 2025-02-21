"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type UpdateSearchParamsProps = {
  searchParamsInPage: string[];
};

type SearchParam = {
  key: string;
  value: string;
};

export default function useUpdateSearchParams({ searchParamsInPage }: UpdateSearchParamsProps) {
  const pathName = usePathname();
  const searchParamsHook = useSearchParams();
  const { replace } = useRouter();

  const handleUpdateSearchParams = useCallback(
    (params: SearchParam[]) => {
      const currentParams = new URLSearchParams(searchParamsHook.toString());

      // Actualizar los nuevos parámetros de búsqueda
      params.forEach((param) => {
        currentParams.set(param.key, param.value);
      });

      // Mantener los parámetros de búsqueda especificados en `searchParamsInPage`
      searchParamsInPage.forEach((param) => {
        if (!params.some((p) => p.key === param)) {
          const value = searchParamsHook.get(param);
          if (value !== null) {
            currentParams.set(param, value);
          }
        }
      });

      replace(`${pathName}?${currentParams.toString()}`, { scroll: false });
    },
    [pathName, replace, searchParamsHook, searchParamsInPage]
  );

  const handleReset = useCallback(
    (keysToKeep: string[]) => {
      const currentParams = new URLSearchParams(searchParamsHook.toString());
      const newParams = new URLSearchParams();

      // Mantener solo los parámetros especificados en `keysToKeep`
      keysToKeep.forEach((key) => {
        const value = currentParams.get(key);
        if (value !== null) {
          newParams.set(key, value);
        }
      });

      replace(`${pathName}?${newParams.toString()}`, { scroll: false });
    },
    [pathName, replace, searchParamsHook]
  );

  const getValueToSearchParam = (key: string) => searchParamsHook.get(key) || null;
  const deleteSarchParam = (key: string) => {
    const currentParams = new URLSearchParams(searchParamsHook.toString());
    currentParams.delete(key);
    replace(`${pathName}?${currentParams.toString()}`);
  }

  const getCurrentSearchParams = () => {
    return `${searchParamsHook.toString()}`;
  }
  return { handleUpdateSearchParams, handleReset, getValueToSearchParam, deleteSarchParam, getCurrentSearchParams };
}
