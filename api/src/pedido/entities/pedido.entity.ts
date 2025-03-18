import { EstadoPedido } from '@prisma/client';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { DetallePedido } from '../../detalle-pedido/entities/detalle-pedido.entity';
import { Entrega } from '../../entrega/entities/entrega.entity';
import { OrdenCompra } from '../../orden-compra/entities/orden-compra.entity';

export class Pedido {
  id: string;
  fechaRecibido: Date;
  cliente: Cliente;
  clienteDocumento: string;
  estado: string;
  observaciones?: string;
  fechaRequerimiento: Date;
  fechaEntrega?: Date;
  tiempoEntrega?: number;
  pesoDespachado?: number;
  productos: DetallePedido[];
  entregas: Entrega[];
  ordenesCompra: OrdenCompra[];
}

export interface PedidoDataTable {
  id?:string;
  cliente?: {
    nombre?: string
  };
  idCliente?: string
  fechaRecibido?: string
  ordenCompra?: string
  estado?: EstadoPedido
  cantidadDetallesPedido?: number;
}
