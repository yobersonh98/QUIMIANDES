import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { UpdateEntregaDto } from './dto/update-entrega.dto';
import { EntregaProductoService } from './../entrega-producto/entrega-producto.service';

@Injectable()
export class EntregaService {
  constructor(private readonly prisma: PrismaService,
    private readonly entregraProductoService: EntregaProductoService
  ) {}

  async create(createEntregaDto: CreateEntregaDto) {
    const {pedidoId,vehiculoExterno, vehiculoInterno,remision,entregadoPorA, observaciones, entregasProducto} = createEntregaDto;
    console.log('Entrengas' ,entregasProducto)
    const entrega  =  await this.prisma.entrega.create({
        data: {
          pedidoId,
          vehiculoExterno,
          vehiculoInterno,
          remision,
          entregadoPorA,
          observaciones,
          entregaProductos: {
            createMany: {
              data: entregasProducto.map(p => ({
                detallePedidoId: p.detallePedidoId,
                cantidadDespachada: p.cantidadDespachada,
                fechaEntrega: p.fechaEntrega,
                observaciones: p.observaciones,
              }))
            }
          }
        }
    });
    return entrega;
  }

  async findAll() {
    return await this.prisma.entrega.findMany({
      include: { pedido: true },
    });
  }

  async findOne(id: string) {
    const entrega = await this.prisma.entrega.findUnique({
      where: { id },
      include: { pedido: true },
    });
    if (!entrega) {
      throw new NotFoundException(`Entrega con id ${id} no encontrada`);
    }
    return entrega;
  }

  async update(id: string, updateEntregaDto: UpdateEntregaDto) {
    return await this.prisma.entrega.update({
      where: { id },
      data: updateEntregaDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.entrega.delete({
      where: { id },
    });
  }
}
