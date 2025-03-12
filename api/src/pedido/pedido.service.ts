import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PedidoService {
  constructor(private readonly prisma: PrismaService) {}

  async create({detallesPedido, ...infoPedido}: CreatePedidoDto) {
    try {
      const pedido = await this.prisma.pedido.create({
        data: {
          ...infoPedido,
          productos: {
            createMany: {
              data: detallesPedido
            }
          }
        }
      })
      return pedido
    } catch (error) {
      console.log(error);
    }
  }

  async findAll() {
    return await this.prisma.pedido.findMany({
      include: {
        cliente: true,
        productos: true,
        entregas: true,
        ordenesCompra: true,
      },
    });
  }

  async findOne(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        cliente: true,
        productos: true,
        entregas: true,
        ordenesCompra: true,
      },
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return pedido;
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    return await this.prisma.pedido.update({
      where: { id },
      data: updatePedidoDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.pedido.delete({
      where: { id },
    });
  }
}
