import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaTransacction } from './../common/types';
import { CreateDetallePedidoDto } from './../detalle-pedido/dto/create-detalle-pedido.dto';
import { esVacio } from './../common/utils/string.util';
import { DetallePedido } from '@prisma/client';

@Injectable()
export class IdGeneratorService {
  constructor(private prisma: PrismaService) {}

  /**
   * Genera un nuevo ID para un pedido con formato PD-XX
   */
  async generarIdPedido(): Promise<string> {
    const idResult = await this.prisma.$queryRaw<[{ generar_id_pedido: string }]>`
      SELECT generar_id_pedido()
    `;
    return idResult[0].generar_id_pedido;
  }

  /**
   * Genera un nuevo ID para una entrega con formato ET-XX
   * @returns Promise con el ID generado
   */
    async generarIdEntrega(): Promise<string> {
      const idResult = await this.prisma.$queryRaw<[{generar_id_entrega: string}]>`
        SELECT generar_id_entrega()
      `;
      return idResult[0].generar_id_entrega;
    }

  /**
   * Genera un nuevo ID para un detalle de pedido con formato PD-XX-YY
   */
  async generarIdDetallePedido(
    pedidoId: string,
    tx: PrismaTransacction = this.prisma
  ): Promise<string> {
    const detalleIdResult = await tx.$queryRaw<[{ generar_id_detalle_pedido: string }]>`
      SELECT generar_id_detalle_pedido(${pedidoId})
    `;
    return detalleIdResult[0].generar_id_detalle_pedido;
  }

  /**
   * Obtiene el último ID existente de un detalle de pedido para un pedido específico
   */
  async obtenerUltimoIdDetallePedido(pedidoId: string): Promise<string | null> {
    const result = await this.prisma.detallePedido.findFirst({
      where: { pedidoId },
      orderBy: { id: 'desc' },
      select: { id: true },
    });
    return result?.id || null;
  }

  /**
   * Genera el siguiente ID de detalle de pedido en base al último existente
   */
  async generarSiguienteIdDetallePedido(pedidoId: string): Promise<string> {
    const ultimoId = await this.obtenerUltimoIdDetallePedido(pedidoId);
    let siguienteNumero = 1;

    if (ultimoId) {
      const partes = ultimoId.split('-');
      const ultimoNumero = parseInt(partes[partes.length - 1], 10);
      siguienteNumero = isNaN(ultimoNumero) ? 1 : ultimoNumero + 1;
    }

    return `${pedidoId}-${siguienteNumero}`;
  }

  /**
   * Mapea los detalles del pedido con IDs secuenciales para creación
   */
  mapearDetallesPedidoConIdsEnCreacion(
    pedidoId: string,
    detallesPedido: CreateDetallePedidoDto[]
  ): CreateDetallePedidoDto[] {
    return detallesPedido.map((dp, i) => {
      return {
        ...dp,
        pedidoId,
        lugarEntregaId: esVacio(dp.lugarEntregaId) ? undefined : dp.lugarEntregaId,
      };
    });
  }

  /**
   * Mapea los detalles del pedido con nuevos IDs secuenciales en actualización (sin repetir IDs existentes)
   */
  async mapearDetallesPedidoConIdsEnActualizacion(
    pedidoId: string,
    nuevosDetalles: CreateDetallePedidoDto[]
  ): Promise<CreateDetallePedidoDto[]> {
    const ultimoId = await this.obtenerUltimoIdDetallePedido(pedidoId);

    let contador = 1;
    if (ultimoId) {
      const partes = ultimoId.split('-');
      const ultimoNumero = parseInt(partes[partes.length - 1], 10);
      contador = isNaN(ultimoNumero) ? 1 : ultimoNumero + 1;
    }

    return nuevosDetalles.map((dp, i) => ({
      ...dp,
      pedidoId,
      id: `${pedidoId}-${contador + i}`,
      lugarEntregaId: esVacio(dp.lugarEntregaId) ? undefined : dp.lugarEntregaId,
    }));
  }
}
