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
  if (!detallePedido?.lugarEntrega) return '';

  const { nombre, ciudad, direccion } = detallePedido.lugarEntrega;

  const partes: string[] = [
    direccion?.trim(),
    nombre?.trim(),
    ciudad?.nombre?.trim(),
  ].filter((parte): parte is string => Boolean(parte)); // Filtra null, undefined y cadenas vacías

  return partes.join(', ');
};


export const obtenerCantidadPorEntregar = (detallePedido: DetallePedidoEntity): number => {
  const cantidadPorEntregar = detallePedido.cantidad - detallePedido.cantidadEntregada;
  return cantidadPorEntregar > 0 ? cantidadPorEntregar : 0;
}