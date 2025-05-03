export interface EntregaListadoItem {
  id: string;
  estado: string; // o EstadoEntrega si usas el enum directamente
  fechaCreacion: Date;
  fechaEntrega: Date | null;
  observaciones: string | null;
  entregadoPorA: string | null;
  remision: string | null;
  vehiculoExterno: string | null;
  vehiculoInterno: string | null;
  cantidadProductos: number;
}
