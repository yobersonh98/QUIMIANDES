export interface EntregaEntity {
  id: string;
  pedidoId: string;
  vehiculoInterno?: string;
  vehiculoExterno?: string;
  entregadoPorA: string;
  lugarEntregaId: string;
  remision?: string;
  observaciones?: string;
}