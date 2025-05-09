import { EstadoEntrega } from "./entrega.entity";
import { EntregaProdcutoEntity } from "./entrega-producto.entity";

export interface EntregaListadoItemEntity{
  id: string;
  codigo: string;
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
  entregaProductos: EntregaProdcutoEntity[]
  pedido: {
    codigo: string;
    cliente: {
      nombre: string;
    };
  }
}
