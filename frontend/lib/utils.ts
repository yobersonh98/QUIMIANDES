import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Formatea una fecha según el tipo especificado.
 * @param date Fecha a formatear (puede ser string o Date).
 * @param type Tipo de formato a aplicar: "fecha", "hora", "fechaHora".
 * @returns Fecha formateada o un mensaje si la fecha es inválida.
 */
export const formatFecha = (date?: string | Date, type: "fecha" | "hora" | "fechaHora" = "fecha"): string => {
  if (!date) return "Fecha no disponible";
  
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(parsedDate.getTime())) return "Fecha inválida";

  const formats = {
    fecha: "dd-MM-yyyy", // 17-03-2025
    hora: "HH:mm:ss",    // 14:30:15
    fechaHora: "dd-MM-yyyy HH:mm:ss", // 17-03-2025 14:30:15
  };

  return format(parsedDate, formats[type]);
};


export const formatearFecha = (date: Date | string | undefined) => {
  if (!date) return "N/A"
  return format(new Date(date), "dd/MM/yyyy HH:mm")
}

export const calcularPorcentaje = (cantidadTotal: number, cantidad: number) => {
  return Math.min(Math.round((cantidad / cantidadTotal) * 100), 100)
}