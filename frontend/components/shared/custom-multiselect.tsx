import * as React from "react"
import { CheckIcon } from "@radix-ui/react-icons" // Ícono opcional
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils" // función de utilidades para combinar clases opcionalmente

interface Option {
  value: string
  label: string
}

interface CustomMultiSelectProps {
  options: Option[]
  onChange: (values: string[]) => void
  placeholder?: string
  label?: string
  className?: string
  values?: string[]
}

export function CustomMultiSelect({
  options,
  onChange,
  placeholder = "Seleccione opciones",
  label,
  className = "w-full",
  values,
}: CustomMultiSelectProps) {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(values || [])

  const handleSelect = (value: string) => {
    let updatedValues: string[]
    if (selectedValues.includes(value)) {
      updatedValues = selectedValues.filter((v) => v !== value)
    } else {
      updatedValues = [...selectedValues, value]
    }
    setSelectedValues(updatedValues)
    onChange(updatedValues)
  }

  const displayText = selectedValues.length
    ? options.filter((o) => selectedValues.includes(o.value)).map((o) => o.label).join(", ")
    : placeholder

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className={cn("justify-between bg-transparent", className)}>
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2">
        {label && <p className="text-sm font-semibold mb-2">{label}</p>}
        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="flex items-center gap-2 cursor-pointer hover:bg-accent px-2 py-1 rounded"
            >
              <div className={cn(
                "w-4 h-4 flex items-center justify-center border rounded",
                selectedValues.includes(option.value) ? "bg-primary text-primary-foreground" : "bg-background"
              )}>
                {selectedValues.includes(option.value) && <CheckIcon className="w-3 h-3" />}
              </div>
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
