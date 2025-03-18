import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
  async generarIdDetallePedido(pedidoId: string): Promise<string> {
    const detalleIdResult = await this.prisma.$queryRaw<[{generar_id_detalle_pedido: string}]>`
      SELECT generar_id_detalle_pedido(${pedidoId})
    `;
    return detalleIdResult[0].generar_id_detalle_pedido;
  }
}