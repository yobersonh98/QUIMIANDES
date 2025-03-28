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

  lugarEntrega: {
    nombre: string;
    id: string;
    ciudad: {
      nombre: string;
    }
  };

  tipoEntrega: string;

  fechaEntrega: Date;
}