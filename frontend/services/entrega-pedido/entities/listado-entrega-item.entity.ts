import { EstadoEntrega } from "./entrega.entity";

export interface EntregaListadoItemEntity{
  id: string;
  estado: EstadoEntrega; // o EstadoEntrega si usas el enum directamente
  fechaCreacion: Date;
  fechaEntrega: Date | null;
  observaciones: string | null;
  entregadoPorA: string | null;
  remision: string | null;
  vehiculoExterno: string | null;
  vehiculoInterno: string | null;
  pedidoId:string
  cantidadProductos: number;
}
