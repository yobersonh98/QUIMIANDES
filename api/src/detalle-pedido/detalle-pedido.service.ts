import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDetallePedidoDto } from './dto/create-detalle-pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle-pedido.dto';
import { IdGeneratorService } from './../services/IdGeneratorService';
import { esVacio } from './../common/utils/string.util';
import { DetallePedido } from '@prisma/client';
import { PrismaTransacction } from './../common/types';

@Injectable()
export class DetallePedidoService {
  private logger = new Logger(DetallePedidoService.name)
  constructor(private readonly prisma: PrismaService,
    private idGeneratorService: IdGeneratorService,

  ) {}

  async create(createDetallePedidoDto: CreateDetallePedidoDto) {
    const idDetallePeido = await this.idGeneratorService.generarIdDetallePedido(createDetallePedidoDto.pedidoId);
    const detallePedido = await this.prisma.detallePedido.create({
      data: {
        ...createDetallePedidoDto,
        lugarEntregaId: esVacio(createDetallePedidoDto.lugarEntregaId) ? undefined : createDetallePedidoDto.lugarEntregaId,
        id: idDetallePeido,
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

  async update(id: string, updateDetallePedidoDto: UpdateDetallePedidoDto, tx: PrismaTransacction = this.prisma) {
    return await tx.detallePedido.update({
      where: { id },
      data: updateDetallePedidoDto,
    });
  }

  public esCantidadTotalDespachada (detallesPedido: DetallePedido[] = []): boolean {
      const esCantidadTotalDespachada = detallesPedido.every(dp => {
        console.log('dp', dp)
        return dp.cantidadDespachada >= dp.cantidad
      })
      console.log('EnCantidadTotalDespachada: ', esCantidadTotalDespachada)
      return esCantidadTotalDespachada
  }
  async enCantidadTotalDespachadaPedido (pedidoId: string):Promise<boolean> {
    try {
      const detallesPedido = await this.findAll(pedidoId);
      return this.esCantidadTotalDespachada(detallesPedido)
    } catch (error) {
      this.logger.error(error)
      return false
    }
  }

  async remove(id: string) {
    return await this.prisma.detallePedido.delete({
      where: { id },
    });
  }
}
