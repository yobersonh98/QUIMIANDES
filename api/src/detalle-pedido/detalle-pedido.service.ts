import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDetallePedidoDto } from './dto/create-detalle-pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle-pedido.dto';
import { IdGeneratorService } from './../services/IdGeneratorService';
import { esVacio } from './../common/utils/string.util';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class DetallePedidoService {
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

  async findAll(pedidoId:string) {
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

  async update(id: string, updateDetallePedidoDto: UpdateDetallePedidoDto) {
    return await this.prisma.detallePedido.update({
      where: { id },
      data: updateDetallePedidoDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.detallePedido.delete({
      where: { id },
    });
  }
}
