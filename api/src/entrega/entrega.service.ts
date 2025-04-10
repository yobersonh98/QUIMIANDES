import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { UpdateEntregaDto } from './dto/update-entrega.dto';
import { EntregaProductoService } from './../entrega-producto/entrega-producto.service';
import { DetallePedidoService } from './../detalle-pedido/detalle-pedido.service';
import { EstadoDetallePedido, EstadoEntrega, EstadoPedido, TipoEntregaProducto } from '@prisma/client';
import { PedidoService } from './../pedido/pedido.service';
import { RegistrarDespachoDetallePedidoDto } from './../entrega-producto/dto/registrar-despacho-detalle-pedido.dto';
import { CompletarEntregaDto } from './dto/finalizar-entrega.dto';
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

  /**
   *  Confirma el despacho de entrega de un pedido. Actualiza el estado de los detalles de pedido y la entrega.
   * @param RegistrarDespachoDetallePedidoDto dto de despacho de entrega
   * @param entregaId id de la entrega
   * @param despachosEntregaProducto lista de despachos de entrega
   * @returns  entrega actualizada
   */
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
          const cantidadTotalDespachada = detallePedido.cantidadDespachada + cantidadDespachada;
          if (cantidadTotalDespachada > detallePedido.cantidad) {
            throw new BadRequestException(`La cantidad despachada (${cantidadTotalDespachada}) supera la cantidad total (${detallePedido.cantidad})`);
          }
          const esEntregaEnPlanta = detallePedido.tipoEntrega === TipoEntregaProducto.RECOGE_EN_PLANTA;
          const entregaProductoSaved = await this.entregraProductoService.update(entregaProductoId, {
            cantidadDespachada,
            cantidadEntregada: esEntregaEnPlanta && cantidadDespachada
          }, tx);

          if (esEntregaEnPlanta) {
            detallePedido.estado = EstadoDetallePedido.ENTREGADO;
            detallePedido.cantidadEntregada = cantidadTotalDespachada;
          } else {
            detallePedido.estado = cantidadTotalDespachada === detallePedido.cantidad ? EstadoDetallePedido.EN_TRANSITO : EstadoDetallePedido.PARCIAL;
          }
          await this.detallePedidoService.update(detallePedido.id, {
            cantidadDespachada: cantidadTotalDespachada,
            estado: detallePedido.estado,
            cantidadEntregada: detallePedido.cantidadEntregada,
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

  /**
   *  Completa la entrega de un pedido. Actualiza el estado de los detalles de pedido y la entrega.
   * @param CompletarEntregaDto dto de completar entrega
   * @returns entrega actualizada
   * @throws NotFoundException si la entrega no existe
   * @throws BadRequestException si la cantidad entregada supera la cantidad total
   * @throws BadRequestException si el detalle de pedido ya está en estado entregado o cancelado
   * @throws BadRequestException si la cantidad entregada es menor a la cantidad despachada
   */
  async completarEntrega({entregaId, entregaProductos }: CompletarEntregaDto) {
    const entrega = await this.prisma.entrega.findUnique({
      where: { id: entregaId },
    });
    if (!entrega) {
      throw new NotFoundException(`Entrega con id ${entregaId} no encontrada`);
    }
    const detallesPedido = await this.detallePedidoService.findAll(entrega.pedidoId);
    const detallesPedidoActualizados = entregaProductos.map(({ detallePedidoId, cantidadEntregada }) => {
      const detallePedido = detallesPedido.find(dp => dp.id === detallePedidoId);
      const cantidadTotalEntregadoDetallePedido = detallePedido.cantidadEntregada + cantidadEntregada;

      if (cantidadTotalEntregadoDetallePedido > detallePedido.cantidad) {
        throw new BadRequestException(`La cantidad entregada (${cantidadTotalEntregadoDetallePedido})
          supera la cantidad total (${detallePedido.cantidad}) en el detalle de pedido con id ${detallePedidoId}`);
      }
      if (!detallePedido) {
        throw new NotFoundException(`Detalle de pedido con id ${detallePedidoId} no encontrado`);
      }
      if (detallePedido.estado == EstadoDetallePedido.ENTREGADO || detallePedido.estado == EstadoDetallePedido.CANCELADO) {
        throw new BadRequestException(`El detalle de pedido con id ${detallePedidoId} ya está en estado entregado o cancelado`);
      }
      if (detallePedido.cantidad === cantidadTotalEntregadoDetallePedido) {
        detallePedido.estado = EstadoDetallePedido.ENTREGADO;
      }
      if (detallePedido.cantidad < cantidadTotalEntregadoDetallePedido) {
        detallePedido.estado = EstadoDetallePedido.PARCIAL;
      }
      return detallePedido
    })

    return this.prisma.$transaction(async (tx) => {
      await Promise.all(
        detallesPedidoActualizados.map(async (detallePedido) => {
          await this.detallePedidoService.update(detallePedido.id, {
            cantidadEntregada: detallePedido.cantidadEntregada,
            estado: detallePedido.estado,
            cantidadDespachada: detallePedido.cantidadDespachada,
          }, tx);
        })
      );
      const entregaFinalizada = await tx.entrega.update({
        where: { id: entregaId },
        data: {
          estado: EstadoPedido.ENTREGADO,
          entregaProductos: {
            updateMany: entregaProductos.map(({ entregaProductoId, cantidadEntregada, observaciones }) => ({
              where: { id: entregaProductoId },
              data: {
                cantidadEntregada,
                observaciones,
              }
            }))
          }
        },
      });
      
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
      select: {
        id: true,
        estado: true,
        vehiculoExterno: true,
        vehiculoInterno: true,
        remision: true,
        entregadoPorA: true,
        observaciones: true,
        pedidoId: true,
        pedido: {
          select: {
            id: true,
            estado: true,
            fechaRecibido: true,
            ordenCompra: true,
            cliente: {
              select: {
                id: true,
                nombre: true,
                direccion: true,
                telefono: true,
              }
            }
          }
        },
        entregaProductos: {
          select: {
            id: true,
            cantidadDespachada: true,
            cantidadEntregada: true,
            cantidadDespachar: true,
            observaciones: true,
            detallePedidoId: true,
            detallePedido: {
              select: {
                id: true,
                cantidad: true,
                cantidadDespachada: true,
                cantidadEntregada: true,
                estado: true,
                productoId: true,
                tipoEntrega: true,
                lugarEntregaId: true,
                lugarEntrega: {
                  select: {
                    id: true,
                    nombre: true,
                    ciudad: true,
                  }
                },
                producto: {
                  select: {
                    id: true,
                    nombre: true,
                    unidadMedida: true,
                    presentacion: true,
                  }
                },
              }
            }
          }
        }
      }
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
