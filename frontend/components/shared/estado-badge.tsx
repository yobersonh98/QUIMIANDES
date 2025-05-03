import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle, 
  Ban, 
  Hourglass, 
  ThumbsUp, 
  ShieldAlert, 
  Loader2
} from "lucide-react";

// Definir los tipos para las configuraciones de estado
type VariantType = "default" | "destructive" | "outline" | "secondary";

interface EstadoConfig {
  icon: React.ReactNode;
  variant: VariantType;
  color: string;
}

// Tipo para las claves de ESTADOS_CONFIG
type EstadoKey = 
  | "PENDIENTE" 
  | "EN_TRANSITO" 
  | "PARCIAL" 
  | "ENTREGADO"
  | "CANCELADO" 
  | "EN_ESPERA" 
  | "PROCESANDO" 
  | "APROBADO" 
  | "RECHAZADO" 
  | "ALERTA";

// Definir la configuración de los estados
const ESTADOS_CONFIG: Record<EstadoKey, EstadoConfig> = {
  // Estados comunes
  "PENDIENTE": { 
    icon: <Clock className="h-4 w-4 text-blue-500" />, 
    variant: "outline",
    color: "border-blue-500"
  },
  "EN_TRANSITO": { 
    icon: <Truck className="h-4 w-4 text-blue-500" />, 
    variant: "outline",
    color: "border-blue-500"
  },
  "PARCIAL": { 
    icon: <Truck className="h-4 w-4 text-yellow-500" />, 
    variant: "secondary",
    color: "border-yellow-500"
  },
  "ENTREGADO": { 
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />, 
    variant: "default",
    color: "border-green-500" 
  },
  
  // Estados adicionales
  "CANCELADO": {
    icon: <Ban className="h-4 w-4 text-red-500" />,
    variant: "destructive",
    color: "border-red-500"
  },
  "EN_ESPERA": {
    icon: <Hourglass className="h-4 w-4 text-orange-500" />,
    variant: "outline",
    color: "border-orange-500"
  },
  "PROCESANDO": {
    icon: <Loader2 className="h-4 w-4 text-purple-500 animate-spin" />,
    variant: "outline",
    color: "border-purple-500"
  },
  "APROBADO": {
    icon: <ThumbsUp className="h-4 w-4 text-green-500" />,
    variant: "default",
    color: "border-green-500"
  },
  "RECHAZADO": {
    icon: <AlertCircle className="h-4 w-4 text-red-500" />,
    variant: "destructive", 
    color: "border-red-500"
  },
  "ALERTA": {
    icon: <ShieldAlert className="h-4 w-4 text-amber-500" />,
    variant: "secondary",
    color: "border-amber-500"
  }
};

// Configuración por defecto
const ESTADO_DEFAULT: EstadoConfig = {
  icon: <AlertCircle className="h-4 w-4 text-gray-500" />,
  variant: "outline",
  color: "border-gray-500"
};

// Props del componente
export interface EstadoBadgeProps {
  estado: string;
  className?: string;
  icon?: React.ReactNode;
  variant?: VariantType;
}

/**
 * Componente que muestra un badge con un ícono según el estado proporcionado
 * 
 * @param props - Propiedades del componente
 * @param props.estado - Estado en español (ej: "PENDIENTE", "ENTREGADO")
 * @param props.className - Clases adicionales para el Badge
 * @param props.icon - Ícono personalizado (opcional)
 * @param props.variant - Variante personalizada del Badge (opcional)
 * @returns Badge con ícono y texto del estado
 */
export default function EstadoBadge({ 
  estado, 
  className = "",
  icon,
  variant
}: EstadoBadgeProps): React.JSX.Element {
  // Normalizar el estado (convertir a mayúsculas y reemplazar espacios por guiones bajos)
  const estadoNormalizado = typeof estado === 'string' 
    ? estado.toUpperCase().replace(/\s+/g, '_') as EstadoKey
    : '' as EstadoKey;

  // Obtener la configuración para el estado o usar la configuración por defecto
  const config = ESTADOS_CONFIG[estadoNormalizado] || ESTADO_DEFAULT;
  
  // Usar los valores proporcionados o los de la configuración
  const iconoFinal = icon || config.icon;
  const varianteFinal = variant || config.variant;
  
  // Formatear el texto del estado para mostrarlo (convertir guiones bajos a espacios)
  const textoEstado = estadoNormalizado.replace(/_/g, ' ');

  return (
    <Badge 
      variant={varianteFinal} 
      className={`flex items-center gap-1 ${className}`}
    >
      {iconoFinal}
      {textoEstado}
    </Badge>
  );
}

// Ejemplo de uso:
// <EstadoBadge estado="PENDIENTE" />
// <EstadoBadge estado="entregado" /> // También funciona con minúsculas
// <EstadoBadge estado="En Espera" /> // También funciona con espacios