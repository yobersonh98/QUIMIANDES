import { CrearEntregaProductoModel } from "./crear-entrega-producto";

export interface CrearEntregaModel {
  pedidoId: string;
  vehiculoInterno?: string;
  vehiculoExterno?: string;
  entregadoPorA: string;
  remision?: string;
  observaciones?: string;
  entregasProducto?: CrearEntregaProductoModel[]
}