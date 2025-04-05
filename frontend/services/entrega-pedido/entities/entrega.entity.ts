
export type EstadoEntrega =
  | "PENDIENTE"
  | "EN_TRANSITO"
  | "ENTREGADO"
  | "CANCELADO"

export interface EntregaEntity {
  id: string;
  pedidoId: string;
  vehiculoInterno?: string;
  vehiculoExterno?: string;
  entregadoPorA: string;
  lugarEntregaId: string;
  estado: EstadoEntrega;
  remision?: string;
  observaciones?: string;
}