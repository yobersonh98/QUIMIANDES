import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDetallePedidoDto } from './dto/create-detalle-pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle-pedido.dto';
import { IdGeneratorService } from './../services/IdGeneratorService';
import { esVacio } from './../common/utils/string.util';
import { DetallePedido, EstadoDetallePedido, Prisma, PrismaClient, TipoOperacion } from '@prisma/client';
import { PrismaTransacction } from './../common/types';
import { AuditoriaLogService } from './../auditoria-log/auditoria-log.service';

@Injectable()
export class DetallePedidoService {
  private logger = new Logger(DetallePedidoService.name)
  constructor(private readonly prisma: PrismaService,
    private idGeneratorService: IdGeneratorService,
    private auditService: AuditoriaLogService

  ) {}

  async create(createDetallePedidoDto: CreateDetallePedidoDto) {
    const detallePedido = await this.prisma.detallePedido.create({
      data: {
        ...createDetallePedidoDto,
        lugarEntregaId: esVacio(createDetallePedidoDto.lugarEntregaId) ? undefined : createDetallePedidoDto.lugarEntregaId,
      },
    });
    return detallePedido;
  }

  async findAll(pedidoId:string): Promise<DetallePedido[]> {
    return await this.prisma.detallePedido.findMany({
      where: {
        pedidoId,
      },
    });
  }

  async findOne(id: string) {
    const detalle = await this.prisma.detallePedido.findUnique({
      where: { id },
      include: { pedido: true, producto: true },
    });
    if (!detalle) {
      throw new NotFoundException(`DetallePedido con id ${id} no encontrado`);
    }
    return detalle;
  }

   puedeSerModificado (detallePedido: DetallePedido) {
    return (detallePedido.estado !== 'CANCELADO') && (detallePedido.estado !== 'ENTREGADO')
  }

  async update(id: string, updateDetallePedidoDto: UpdateDetallePedidoDto, tx: PrismaTransacction = this.prisma) {
    return await tx.detallePedido.update({
      where: { id },
      data: updateDetallePedidoDto,
    });
  }

  async actualizarConValidacion(id: string, updateDetallePedidoDto: UpdateDetallePedidoDto, omitValidacionEntregas= false) {
    if (!omitValidacionEntregas) {
      await this.hayAlgunaEntregaSinGestionar(id);
    }
    if (updateDetallePedidoDto.estado === 'ENTREGADO') {
      const cantidadSinFinalizar = await this.contarDetallesPedidoSinFinalizar(updateDetallePedidoDto.pedidoId, id) ;
      if (!cantidadSinFinalizar && updateDetallePedidoDto.pedidoId) {
        const pedido  = await this.prisma.pedido.update({
          where: {
            id: updateDetallePedidoDto.pedidoId,
          },
          data: {
            estado: 'ENTREGADO'
          }
        })
        await this.auditService.log({
          descripcion: `Se ha marcado como entregado el pedido ${pedido.codigo} automaticamente`,
          tipoOperacion: TipoOperacion.ACTUALIZAR,
          nivel: 'INFO',
          usuarioId: updateDetallePedidoDto.usuarioId,
          entidad: 'Pedido'
        })
      }
    }
    const detallePedido = await this.update(id, updateDetallePedidoDto)
    await this.auditService.logUpdate('Detalle Pedido',detallePedido.id, undefined, detallePedido, updateDetallePedidoDto.usuarioId)
    return detallePedido
  }

  public async hayAlgunaEntregaSinGestionar(detallePedidoId: string, tx:PrismaClient= this.prisma) {
    const detallePedido = await tx.detallePedido.findFirst({
      where: {
        id: detallePedidoId,
        entregasDetallePedido: {
          some: {
            entrega: {
              estado: {
                in: ['EN_TRANSITO', 'PENDIENTE']
              }
            }
          }
        }
      }
    })
    if (detallePedido) throw new ConflictException(
      'No es posible marcar este producto como entregado porque tiene entregas en tránsito o pendientes por finalizar.'
    );
    return detallePedido
  }

  public async marcarComoEntregado(detallePedidoId: string) {
    await this.hayAlgunaEntregaSinGestionar(detallePedidoId);
    return this.update(detallePedidoId, {
      estado: EstadoDetallePedido.ENTREGADO
    })
  }
  public esCantidadTotalDespachada (detallesPedido: DetallePedido[] = []): boolean {
      const esCantidadTotalDespachada = detallesPedido.every(dp => {
        return dp.cantidadDespachada >= dp.cantidad
      })
      return esCantidadTotalDespachada
  }

  public esCantidadTotalEntregada (detallesPedido: DetallePedido[] = []): boolean {
    const esCantidadTotalEntregada = detallesPedido.every(dp => {
      return dp.cantidadEntregada >= dp.cantidad
    })
    return esCantidadTotalEntregada
  }

  async esCantidadTotalEntregadaPedido(pedidoId: string): Promise<boolean> {
    try {
      const [result]: { cantidadTotal: number | null, cantidadEntregadaTotal: number | null }[] =
        await this.prisma.$queryRaw`
          SELECT 
            SUM("cantidad") as "cantidadTotal", 
            SUM("cantidadEntregada") as "cantidadEntregadaTotal"
          FROM "DetallePedido"
          WHERE "pedidoId" = ${pedidoId}
        `;
  
      if (!result?.cantidadTotal || !result?.cantidadEntregadaTotal) {
        return false;
      }

      return result.cantidadTotal >= result.cantidadEntregadaTotal;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
  
  async enCantidadTotalDespachadaPedido (pedidoId: string):Promise<boolean> {
    try {
      const [result]: { cantidadTotal: number | null, cantidadDespachadaTotal: number | null }[] =
        await this.prisma.$queryRaw`
          SELECT 
            SUM("cantidad") as "cantidadTotal", 
            SUM("cantidadDespachada") as "cantidadDespachadaTotal"
          FROM "DetallePedido"
          WHERE "pedidoId" = ${pedidoId}
        `;

      if (!result?.cantidadTotal || !result?.cantidadDespachadaTotal) {
        return false;
      }

      return result.cantidadTotal === result.cantidadDespachadaTotal;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }


  /**
   * Cuenta la cantidad de detalles de pedido que aún no han sido finalizados 
   * (es decir, que no están en estado 'CANCELADO' ni 'ENTREGADO') para un pedido específico.
   *
   * @param pedidoId - El ID del pedido al cual pertenecen los detalles a evaluar.
   * @param detallePedidoId - (Opcional) ID de un detalle de pedido que se debe excluir del conteo, 
   *                           por ejemplo, porque será marcado como entregado próximamente.
   * 
   * @returns Una promesa que resuelve en el número de detalles de pedido que aún están pendientes o parcialmente entregados.
   * 
   * @example
   * // Contar todos los detalles no finalizados de un pedido
   * const pendientes = await contarDetallesPedidoSinFinalizar('pedido-123');
   *
   * @example
   * // Contar detalles no finalizados, excluyendo uno que ya se está procesando
   * const pendientes = await contarDetallesPedidoSinFinalizar('pedido-123', 'detalle-456');
  */
  async contarDetallesPedidoSinFinalizar(pedidoId: string, detallePedidoId?: string) {
    const where: Prisma.DetallePedidoWhereInput = {
      pedidoId,
      estado: {
        notIn: ['CANCELADO', 'ENTREGADO']
      }
    };
    // Excluir un detalle específico si se proporciona
    if (detallePedidoId) {
      where.id = { not: detallePedidoId };
    }
    const detalles = await this.prisma.detallePedido.findMany({
      where
    })
    return await this.prisma.detallePedido.count({ where });
  }


  async remove(id: string) {
    return await this.prisma.detallePedido.delete({
      where: { id },
    });
  }
}
