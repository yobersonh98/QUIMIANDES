import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDetallePedidoDto } from './dto/create-detalle-pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle-pedido.dto';

@Injectable()
export class DetallePedidoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDetallePedidoDto: CreateDetallePedidoDto) {
    return await this.prisma.detallePedido.create({
      data: createDetallePedidoDto,
    });
  }

  async findAll() {
    return await this.prisma.detallePedido.findMany({
      include: { pedido: true, producto: true },
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
