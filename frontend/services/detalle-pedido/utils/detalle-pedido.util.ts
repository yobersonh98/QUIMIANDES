import { DetallePedidoEntity } from "../entity/detalle-pedido.entity";
import { EntregaEntity } from "@/services/entrega-pedido/entities/entrega.entity";

export const obtenerCantidadPorDespachar = (detallePedido: DetallePedidoEntity): number => {
  const cantidadPorDespachar = detallePedido.cantidad - detallePedido.cantidadDespachada;
  return cantidadPorDespachar > 0 ? cantidadPorDespachar : 0;
}

export const obtenerCantidadPorProgramar = (detallePedido: DetallePedidoEntity, entregas?: EntregaEntity[]): number => {
  const esTodasLasEntregasFinalizadas = entregas?.every(entrega => entrega.estado === 'ENTREGADO' || entrega.estado === 'CANCELADO');
  const cantidadPorProgramar = esTodasLasEntregasFinalizadas ? detallePedido.cantidad - detallePedido.cantidadEntregada : detallePedido.cantidad - detallePedido.cantidadProgramada;
  return cantidadPorProgramar > 0 ? cantidadPorProgramar : 0;
}

export const obtenerLugarEntregaDetallePedido = (detallePedido?: DetallePedidoEntity): string => {
  if (detallePedido?.lugarEntrega) {
    const { nombre, ciudad, direccion } = detallePedido.lugarEntrega;

    const partes: string[] = [
      nombre?.trim(),             // Nombre de la planta primero
      ciudad?.nombre?.trim(),     // Luego ciudad
      direccion?.trim(),          // Luego dirección
    ].filter((parte): parte is string => Boolean(parte));

    return partes.join(', ');
  }
  // Fallback: usar la dirección del cliente si está disponible
  const direccionCliente = detallePedido?.pedido?.cliente?.direccion?.trim();
  return direccionCliente ? `Dirección cliente: ${direccionCliente}` : '';
};


export const obtenerCantidadPorEntregar = (detallePedido: DetallePedidoEntity): number => {
  const cantidadPorEntregar = detallePedido.cantidad - detallePedido.cantidadEntregada;
  return cantidadPorEntregar > 0 ? cantidadPorEntregar : 0;
}