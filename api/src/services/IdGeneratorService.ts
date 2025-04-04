import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaTransacction } from './../common/types';
import { CreateDetallePedidoDto } from './../detalle-pedido/dto/create-detalle-pedido.dto';
import { esVacio } from './../common/utils/string.util';

@Injectable()
export class IdGeneratorService {
  constructor(private prisma: PrismaService) {}

  /**
   * Genera un nuevo ID para un pedido con formato PD-XX
   * @returns Promise con el ID generado
   */
  async generarIdPedido(): Promise<string> {
    const idResult = await this.prisma.$queryRaw<[{generar_id_pedido: string}]>`
      SELECT generar_id_pedido()
    `;
    return idResult[0].generar_id_pedido;
  }

  /**
   * Genera un nuevo ID para un detalle de pedido con formato PD-XX-YY
   * @param pedidoId - ID del pedido principal
   * @returns Promise con el ID generado
   */
  async generarIdDetallePedido(pedidoId: string, tx: PrismaTransacction = this.prisma): Promise<string> {
    const detalleIdResult = await tx.$queryRaw<[{generar_id_detalle_pedido: string}]>`
      SELECT generar_id_detalle_pedido(${pedidoId})
    `;
    return detalleIdResult[0].generar_id_detalle_pedido;
  }

  mapearDetallesPedidoConIdsEnCreacion (pedidoId: string, detallesPedido: CreateDetallePedidoDto[]): CreateDetallePedidoDto[] {
    return detallesPedido.map((dp,i) => {
      const numeroIdDetallePedido = i +1
      return {
        ...dp,
        pedidoId,
        id: `${pedidoId}-${numeroIdDetallePedido}`,
        lugarEntregaId: esVacio(dp.lugarEntregaId) ? undefined : dp.lugarEntregaId,
      }
    })
  }
}