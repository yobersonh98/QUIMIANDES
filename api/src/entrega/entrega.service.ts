import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { UpdateEntregaDto } from './dto/update-entrega.dto';
import { EntregaProductoService } from './../entrega-producto/entrega-producto.service';
import { DetallePedidoService } from './../detalle-pedido/detalle-pedido.service';
import { EstadoEntrega, EstadoPedido } from '@prisma/client';
import { PedidoService } from './../pedido/pedido.service';
import { RegistrarDespachoDetallePedidoDto } from './../entrega-producto/dto/registrar-despacho-detalle-pedido.dto';
import { FinalizarEntregaDto } from './dto/finalizar-entrega.dto';
import { PrismaTransacction } from './../common/types';

@Injectable()
export class EntregaService {
  private logger = new Logger(EntregaService.name);
  constructor(private readonly prisma: PrismaService,
    private readonly entregraProductoService: EntregaProductoService,
    private readonly detallePedidoService: DetallePedidoService,
    private readonly pedidoService: PedidoService,
  ) { }

  async create(createEntregaDto: CreateEntregaDto) {
    const { pedidoId, vehiculoExterno, vehiculoInterno, remision, entregadoPorA, observaciones, entregasProducto } = createEntregaDto;
    const pedido = await this.pedidoService.findOneBasicInfo(pedidoId);
    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${pedidoId} no encontrado`);
    }
    return this.prisma.$transaction(async (tx) => {
      const entrega = await tx.entrega.create({
        data: {
          pedidoId,
          vehiculoExterno,
          vehiculoInterno,
          remision,
          entregadoPorA,
          observaciones,
          entregaProductos: {
            createMany: {
              data: entregasProducto.map(({ detallePedidoId, cantidadDespachar, fechaEntrega, observaciones }) => ({
                detallePedidoId,
                cantidadDespachar,
                fechaEntrega,
                observaciones,
              })),
            },
          },
        },
      });

      if (pedido.estado === EstadoPedido.PENDIENTE) {
        await this.pedidoService.update(pedidoId, {
          estado: EstadoPedido.EN_PROCESO
        }, tx)
      }
      return entrega;
    });
  }

  async confirmarDespachoEntrega({ entregaId, despachosEntregaProducto }: RegistrarDespachoDetallePedidoDto) {
    const entrega = await this.prisma.entrega.findUnique({
      where: { id: entregaId },
    });
    if (!entrega) {
      throw new NotFoundException(`Entrega con id ${entregaId} no encontrada`);
    }
    const detallesPedido = await this.detallePedidoService.findAll(entrega.pedidoId);
    if (!detallesPedido) {
      throw new NotFoundException(`Detalles de pedido para la entrega con id ${entregaId} no encontrados`);
    }
    const entregasProducto = await this.entregraProductoService.listarPorEntregaId(entregaId);

    return this.prisma.$transaction(async (tx) => {
      const depachosRegistrados = await Promise.all(
        despachosEntregaProducto.map(async ({ entregaProductoId, cantidadDespachada }) => {
          const entregaProducto = entregasProducto.find(ep => ep.id === entregaProductoId);
          if (!entregaProducto) {
            throw new NotFoundException(`Entrega producto con id ${entregaProductoId} no encontrado`);
          }
          const detallePedido = detallesPedido.find(dp => dp.id === entregaProducto.detallePedidoId);
          if (!detallePedido) {
            throw new NotFoundException(`Detalle de pedido con id ${entregaProducto.detallePedidoId} no encontrado`);
          }
          if (!detallePedido) {
            throw new NotFoundException(`Detalle de pedido con id ${entregaProductoId} no encontrado`);
          }
          const entregaProductoSaved = await this.entregraProductoService.update(entregaProductoId, {
            cantidadDespachada
          }, tx);
          const cantidadTotalDespachada = detallePedido.cantidadDespachada + cantidadDespachada;
          if (cantidadTotalDespachada > detallePedido.cantidad) {
            throw new BadRequestException(`La cantidad despachada (${cantidadTotalDespachada}) supera la cantidad total (${detallePedido.cantidad})`);
          }
          await this.detallePedidoService.update(detallePedido.id, {
            cantidadDespachada: cantidadTotalDespachada
          }, tx);
          return entregaProductoSaved;
        })
      );
      await this.update(entrega.id, {
        estado: EstadoEntrega.EN_TRANSITO
      }, tx);
      return depachosRegistrados;
    });
  }

  async finalizarEntrega({entregaId, entregaProductos }: FinalizarEntregaDto) {
    const entrega = await this.prisma.entrega.findUnique({
      where: { id: entregaId },
    });
    if (!entrega) {
      throw new NotFoundException(`Entrega con id ${entregaId} no encontrada`);
    }
    return this.prisma.$transaction(async (tx) => {
      const entregaFinalizada = await tx.entrega.update({
        where: { id: entregaId },
        data: {
          estado: EstadoPedido.ENTREGADO,
          entregaProductos: {
            updateMany: entregaProductos.map(({ entregaProductoId, cantidadEntregada }) => ({
              where: { id: entregaProductoId },
              data: {
                cantidadEntregada
              }
            }))
          }
        },
      });
      const detallesPedido = await this.detallePedidoService.findAll(entrega.pedidoId); 

      return entregaFinalizada;
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
      include: { pedido: true, entregaProductos: { include: { detallePedido: {
        include: { producto: true, lugarEntrega: { include: { ciudad: true } } }
      } } } },
    });
    if (!entrega) {
      throw new NotFoundException(`Entrega con id ${id} no encontrada`);
    }
    return entrega;
  }

  async update(id: string, updateEntregaDto: UpdateEntregaDto, tx: PrismaTransacction = this.prisma) {
    return await tx.entrega.update({
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
