// config/estado.ts o similar
import React from "react";
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
import { cn, getBgColorByEstado, getBorderColorByEstado } from "@/lib/utils";
import { Badge } from "./badge";

type VariantType = "default" | "destructive" | "outline" | "secondary";

interface EstadoConfig {
  icon: React.ReactNode;
  variant: VariantType;
  color: string;
}

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
  | "ALERTA"
  | "EN_PROCESO"

function makeIcon(Icon: React.ElementType, estado: string, extra?: string): React.ReactNode {
  return <Icon className={`h-4 w-4 text-white ${extra ?? ''}`} />;
}

const ESTADOS_CONFIG: Record<EstadoKey, EstadoConfig> = {
  "PENDIENTE": {
    icon: makeIcon(Clock, "PENDIENTE"),
    variant: "outline",
    color: getBorderColorByEstado("PENDIENTE")
  },
  "EN_PROCESO": {
    icon: makeIcon(Loader2, "EN_PROCESO"),
    variant: "outline",
    color: getBorderColorByEstado("EN_PROCESO")
  },
  "EN_TRANSITO": {
    icon: makeIcon(Truck, "EN_TRANSITO"),
    variant: "outline",
    color: getBorderColorByEstado("EN_TRANSITO")
  },
  "PARCIAL": {
    icon: makeIcon(Truck, "PARCIAL"),
    variant: "secondary",
    color: getBorderColorByEstado("PARCIAL")
  },
  "ENTREGADO": {
    icon: makeIcon(CheckCircle2, "ENTREGADO"),
    variant: "default",
    color: getBorderColorByEstado("ENTREGADO")
  },
  "CANCELADO": {
    icon: makeIcon(Ban, "CANCELADO"),
    variant: "destructive",
    color: getBorderColorByEstado("CANCELADO")
  },
  "EN_ESPERA": {
    icon: makeIcon(Hourglass, "EN_ESPERA"),
    variant: "outline",
    color: getBorderColorByEstado("EN_ESPERA")
  },
  "PROCESANDO": {
    icon: makeIcon(Loader2, "PROCESANDO", "animate-spin"),
    variant: "outline",
    color: getBorderColorByEstado("PROCESANDO")
  },
  "APROBADO": {
    icon: makeIcon(ThumbsUp, "APROBADO"),
    variant: "default",
    color: getBorderColorByEstado("APROBADO")
  },
  "RECHAZADO": {
    icon: makeIcon(AlertCircle, "RECHAZADO"),
    variant: "destructive",
    color: getBorderColorByEstado("RECHAZADO")
  },
  "ALERTA": {
    icon: makeIcon(ShieldAlert, "ALERTA"),
    variant: "secondary",
    color: getBorderColorByEstado("ALERTA")
  }
};

const ESTADO_DEFAULT: EstadoConfig = {
  icon: makeIcon(AlertCircle, "DEFAULT"),
  variant: "outline",
  color: getBorderColorByEstado("DEFAULT")
};

export { ESTADOS_CONFIG, ESTADO_DEFAULT };


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
}: EstadoBadgeProps): React.JSX.Element {
  const estadoNormalizado = typeof estado === 'string' 
    ? estado.toUpperCase().replace(/\s+/g, '_') as EstadoKey
    : '' as EstadoKey;

  const config = ESTADOS_CONFIG[estadoNormalizado] || ESTADO_DEFAULT;

  const iconoFinal = icon || config.icon;
  const varianteFinal = "default";

  const textoEstado = estadoNormalizado.replace(/_/g, ' ');
  const bgColor = getBgColorByEstado(estado);
  return (
    <Badge
      variant={varianteFinal} 
      className={cn(
        "flex items-center gap-1 text-white",
        bgColor,
        `hover:bg-${bgColor}`,
        className
      )}
    >
      {iconoFinal}
      {textoEstado}
    </Badge>
  );
}