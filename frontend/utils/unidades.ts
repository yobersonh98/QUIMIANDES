import { UnidadMedida } from "@/services/productos/entities/producto.entity";

export const getUnidadMedidaLabel = (unidad: UnidadMedida): string => {
  const labels: Record<string, string> = {
    UND: "unid",
    KG: "kg",
    L: "L",
    M3: "m³",
    M2: "m²"
  };
  return labels[unidad];
};

export const getTotalLabel = (unidad: UnidadMedida): string => {
  switch(unidad) {
    case "UND":
      return "Cantidad Total";
    case "M2":
      return "Área Total";
    case "M3":
      return "Volumen Total";
    default:
      return "Peso Total";
  }
};