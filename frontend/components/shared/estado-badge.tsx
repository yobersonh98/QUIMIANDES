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


export interface EstadoBadgeProps {
  estado: string;
  className?: string;
  icon?: React.ReactNode;
}

/**
 * Componente Badge personalizado con Tailwind puro
 * Muestra un estado con color e ícono, basado en la configuración
 */
export default function EstadoBadge({
  estado,
  className = "",
  icon,
}: EstadoBadgeProps): React.JSX.Element {
  const estadoNormalizado = typeof estado === 'string'
    ? estado.toUpperCase().replace(/\s+/g, "_")
    : "";

  const config = ESTADOS_CONFIG[estadoNormalizado as keyof typeof ESTADOS_CONFIG] || ESTADO_DEFAULT;

  const iconoFinal = icon || config.icon;
  const textoEstado = estadoNormalizado.replace(/_/g, " ");
  const bgColorClass = getBgColorByEstado(estado); // ej: "bg-rose-500"
  
  console.log(bgColorClass === 'bg-red-500')
  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white",
        bgColorClass,
        className
      )}
    >
      {iconoFinal}
      <span className="ml-1">{textoEstado}</span>
    </div>
  );
}