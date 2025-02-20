import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventarioClienteDto } from './dto/create-inventario-cliente.dto';
import { UpdateInventarioClienteDto } from './dto/update-inventario-cliente.dto';

@Injectable()
export class InventarioClienteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInventarioClienteDto: CreateInventarioClienteDto) {
    return await this.prisma.inventarioCliente.create({
      data: createInventarioClienteDto,
    });
  }

  async findAll() {
    return await this.prisma.inventarioCliente.findMany({
      include: { cliente: true, producto: true },
    });
  }

  async findOne(id: string) {
    const inventario = await this.prisma.inventarioCliente.findUnique({
      where: { id },
      include: { cliente: true, producto: true },
    });
    if (!inventario) {
      throw new NotFoundException(`InventarioCliente con id ${id} no encontrado`);
    }
    return inventario;
  }

  async update(id: string, updateInventarioClienteDto: UpdateInventarioClienteDto) {
    return await this.prisma.inventarioCliente.update({
      where: { id },
      data: updateInventarioClienteDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.inventarioCliente.delete({
      where: { id },
    });
  }
}
