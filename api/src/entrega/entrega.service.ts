import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { UpdateEntregaDto } from './dto/update-entrega.dto';
import { EntregaProductoService } from './../entrega-producto/entrega-producto.service';
import { DetallePedidoService } from './../detalle-pedido/detalle-pedido.service';

@Injectable()
export class EntregaService {
  private logger = new Logger(EntregaService.name);
  constructor(private readonly prisma: PrismaService,
    private readonly entregraProductoService: EntregaProductoService,
    private readonly detallePedidoService: DetallePedidoService
  ) { }

  async create(createEntregaDto: CreateEntregaDto) {
    const { pedidoId, vehiculoExterno, vehiculoInterno, remision, entregadoPorA, observaciones, entregasProducto } = createEntregaDto;

    return this.prisma.$transaction(async (prisma) => {
      const entrega = await prisma.entrega.create({
        data: {
          pedidoId,
          vehiculoExterno,
          vehiculoInterno,
          remision,
          entregadoPorA,
          observaciones,
          entregaProductos: {
            createMany: {
              data: entregasProducto.map(({ detallePedidoId, cantidadDespachada, fechaEntrega, observaciones }) => ({
                detallePedidoId,
                cantidadDespachada,
                fechaEntrega,
                observaciones,
              })),
            },
          },
        },
      });

      const detallesPedido = await this.detallePedidoService.findAll(pedidoId);

      const updates = entregasProducto.map(({ detallePedidoId, cantidadDespachada }) => {
        const detallePedido = detallesPedido.find(dp => dp.id === detallePedidoId);
        if (!detallePedido) throw new BadRequestException(`Detalle de pedido ${detallePedidoId} no encontrado`);

        const cantidadTotalDespachada = detallePedido.cantidadDespachada + cantidadDespachada;

        if (cantidadTotalDespachada > detallePedido.cantidad) {
          throw new BadRequestException(`La cantidad máxima a despachar para ${detallePedidoId} es de ${detallePedido.cantidad - detallePedido.cantidadDespachada}`);
        }

        return prisma.detallePedido.update({
          where: { id: detallePedidoId },
          data: { cantidadDespachada: cantidadTotalDespachada },
        });
      });

      // 4️⃣ Ejecutar las actualizaciones en paralelo dentro de la transacción
      await Promise.all(updates);

      return entrega;
    });
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
