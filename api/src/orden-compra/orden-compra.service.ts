import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { UpdateOrdenCompraDto } from './dto/update-orden-compra.dto';

@Injectable()
export class OrdenCompraService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrdenCompraDto: CreateOrdenCompraDto) {
    return await this.prisma.ordenCompra.create({
      data: createOrdenCompraDto,
    });
  }

  async findAll() {
    return await this.prisma.ordenCompra.findMany({
      include: { pedido: true },
    });
  }

  async findOne(id: string) {
    const orden = await this.prisma.ordenCompra.findUnique({
      where: { id },
      include: { pedido: true },
    });
    if (!orden) {
      throw new NotFoundException(`OrdenCompra con id ${id} no encontrada`);
    }
    return orden;
  }

  async update(id: string, updateOrdenCompraDto: UpdateOrdenCompraDto) {
    return await this.prisma.ordenCompra.update({
      where: { id },
      data: updateOrdenCompraDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.ordenCompra.delete({
      where: { id },
    });
  }
}
