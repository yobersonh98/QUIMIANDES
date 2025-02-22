import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  options: Option[]
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
  defaultValue?: string
}

export function CustomSelect({
  options,
  onChange,
  placeholder = "Seleccione una opción",
  label,
  className = "w-full",
  defaultValue
}: CustomSelectProps) {
  return (
    <Select onValueChange={onChange} defaultValue={defaultValue}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {label && <SelectLabel>{label}</SelectLabel>}
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

// Ejemplo de uso:
/*
const options = [
  { value: "1", label: "Opción 1" },
  { value: "2", label: "Opción 2" },
  { value: "3", label: "Opción 3" },
]

<CustomSelect
  options={options}
  onChange={(value) => console.log(value)}
  placeholder="Seleccione una opción"
  label="Título del grupo"
/>
*/