export interface DetallePedidoEntity {
  id: string;

  pedidoId?: string;

  productoId: string;

  producto: {
    nombre: string;
    id: string;
  };

  unidades: number;

  cantidad: number;

  cantidadDespachada: number;

  pesoRecibido: number;

  lugarEntregaId?: string;

  LugarEntrega: {
    nombre: string;
    id: string;
    ciudad: string;
  };

  tipoEntrega: string;

  fechaEntrega: Date;
}