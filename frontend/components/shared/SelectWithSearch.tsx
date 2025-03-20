import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { BACKEND_URL } from '@/config/envs';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectWithSearchProps {
  apiUrl?: string;
  endpoint: string;
  params?: Record<string, string>;
  placeholder?: string;
  onSelect: (value: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  maperOptions: (item: any) => SelectOption;
  defaultValue?: string;
  disabled?: boolean
  value?: string
}

const SelectWithSearch = ({
  apiUrl = BACKEND_URL,
  endpoint,
  params = {},
  placeholder = "Select an item...",
  onSelect,
  maperOptions,
  disabled,
  value,
  defaultValue
}: SelectWithSearchProps) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const session = useSession();
  // Usar useRef para comparar los cambios reales en params
  const prevParamsRef = useRef<Record<string, string>>(params);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchOptions = async (searchTerm = "") => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ ...params, search: searchTerm });
      const response = await fetch(`${apiUrl}/${endpoint}?${queryParams}`, {
        headers: {
          "Authorization": `Bearer ${session.data?.user?.token}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch options");

      const data = await response.json();
      if (Array.isArray(data)) {
        setOptions(data.map(maperOptions));
      } else {
        console.error("API response is not an array", data);
        setOptions([]);
      }
    } catch (error) {
      console.log("Error fetching options:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Verificar si los params cambiaron realmente
  const didParamsChange = () => {
    const prevParams = prevParamsRef.current;

    // Si tienen diferentes cantidades de propiedades
    if (Object.keys(prevParams).length !== Object.keys(params).length) {
      return true;
    }

    // Comparar cada propiedad
    for (const key in params) {
      if (params[key] !== prevParams[key]) {
        return true;
      }
    }

    return false;
  };

  // Efecto para la carga inicial y cuando cambia la sesión o endpoint
  useEffect(() => {
    if (disabled) return;
    if (!session?.data?.user?.token) return;
    fetchOptions();
  }, [session]);

  // Efecto para cuando cambian los parámetros
  useEffect(() => {
    if (!session?.data?.user?.token) return;

    if (didParamsChange()) {
      fetchOptions(search);
      prevParamsRef.current = { ...params };
    }
  }, [params, apiUrl, endpoint]);

  // Efecto para la búsqueda
  useEffect(() => {
    if (!session?.data?.user?.token || search.length === 0) return;

    const timeoutId = setTimeout(() => {
      fetchOptions(search);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (defaultValue) {
      onSelect(defaultValue);
    }
  }, [defaultValue, onSelect]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn([
          "w-full flex items-center justify-between px-3 py-2 text-sm border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
          disabled && "opacity-50 cursor-not-allowed"]
        )}
      >
        <span className="block truncate">
          {value ? options.find((option) => option.value === value)?.label : placeholder}
        </span>
        <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-10 w-full mt-1 bg-background rounded-md shadow-lg border border-input">
          <div className="p-2 flex flex-1 gap-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background"
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {loading ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">Cargando...</div>
            ) : options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">No hay resultados.</div>
            ) : (
              <ul className="py-1">
                {options.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => {
                      onSelect(option.value);
                      setOpen(false);
                    }}
                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                  >
                    <span className="w-4 h-4 mr-2">
                      {value === option.value && <Check className="w-4 h-4 text-primary" />}
                    </span>
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default SelectWithSearch;