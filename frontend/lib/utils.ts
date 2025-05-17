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


// utils/estadoColors.ts
// utils/estadoColors.ts

// 1. Devuelve solo el color base (sin intensidad)
export function getBaseColorByEstado(estado: string): string {
  const normalized = estado.toUpperCase().replace(/\s+/g, '_');

  switch (normalized) {
    case 'ENTREGADO':
    case 'APROBADO':
      return 'green';
    case 'PENDIENTE':
    case 'EN_ESPERA':
      return 'yellow';
    case 'EN_TRANSITO':
    case 'PARCIAL':
    case 'PROCESANDO':
      return 'blue';
    case 'CANCELADO':
    case 'RECHAZADO':
      return 'red';
    case 'ALERTA':
      return 'amber';
    case 'EN_PROCESO':
      return  'blue';
    default:
      return 'gray';
  }
}
// 5. Retorna el color hexadecimal por estado (intensidad 500 por defecto)
export function getHexColorByEstado(estado: string): string {
  const normalized = estado.toUpperCase().replace(/\s+/g, '_');

  switch (normalized) {
    case 'ENTREGADO':
    case 'APROBADO':
      return '#22c55e'; // green-500
    case 'PENDIENTE':
    case 'EN_ESPERA':
      return '#eab308'; // yellow-500
    case 'EN_TRANSITO':
    case 'PARCIAL':
    case 'PROCESANDO':
    case 'EN_PROCESO':
      return '#3b82f6'; // blue-500
    case 'CANCELADO':
    case 'RECHAZADO':
      return '#ef4444'; // red-500
    case 'ALERTA':
      return '#f59e0b'; // amber-500
    default:
      return '#6b7280'; // gray-500
  }
}

// 2. Color con intensidad (por defecto 500)
export function getRawColorByEstado(estado: string, intensity: number = 500): string {
  const baseColor = getBaseColorByEstado(estado);
  return `${baseColor}-${intensity}`;
}

// 3. Background class
export function getBgColorByEstado(estado: string, intensity: number = 500): string {
  const color = getRawColorByEstado(estado, intensity);
  return `bg-${color}`;
}

// 4. Border class (opcional lado: 't', 'b', 'l', 'r')
export function getBorderColorByEstado(
  estado: string, 
  side?: 't' | 'b' | 'l' | 'r', 
  intensity: number = 500
): string {
  const color = getRawColorByEstado(estado, intensity);
  return side ? `border-${side}-${color}` : `border-${color}`;
}
