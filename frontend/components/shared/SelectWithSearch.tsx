import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { BACKEND_URL } from '@/config/envs';

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
  maperOptions: (item: any) => SelectOption;
  defaultValue?: string;
}

const SelectWithSearch = ({
  apiUrl = BACKEND_URL,
  endpoint,
  params = {},
  placeholder = "Select an item...",
  onSelect,
  maperOptions,
  defaultValue = ""
}: SelectWithSearchProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const session = useSession();
  console.log("Session", session)
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

  useEffect(() => {
    if (!session?.data?.user?.token) return;
    fetchOptions();
  }, [apiUrl, endpoint, session]);

  useEffect(() => {
    if (search.length === 0) return;

    const timeoutId = setTimeout(() => {
      fetchOptions(search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
      >
        <span className="block truncate">
          {value ? options.find((option) => option.value === value)?.label : placeholder}
        </span>
        <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Dropdown Panel */}
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
                      const newValue = option.value === value ? "" : option.value;
                      setValue(newValue);
                      onSelect(newValue);
                      setOpen(false);
                    }}
                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                  >
                    <span className="w-4 h-4 mr-2">
                      {value === option.value && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
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