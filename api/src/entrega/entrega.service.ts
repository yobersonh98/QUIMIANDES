import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { UpdateEntregaDto } from './dto/update-entrega.dto';
import { EntregaProductoService } from './../entrega-producto/entrega-producto.service';
import { DetallePedidoService } from './../detalle-pedido/detalle-pedido.service';
import { Entrega, EstadoDetallePedido, EstadoEntrega, EstadoPedido, TipoEntregaProducto } from '@prisma/client';
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

  async create(createEntregaDto: CreateEntregaDto): Promise<Entrega> {
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
  async confirmarEntrega({ entregaId, despachosEntregaProducto }: RegistrarDespachoDetallePedidoDto): Promise<Entrega> {
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

    const validacionesPreparadas = despachosEntregaProducto.map(({ entregaProductoId, cantidadDespachada }) => {
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
      const estado =
        esEntregaEnPlanta
          ? EstadoDetallePedido.ENTREGADO
          : cantidadTotalDespachada === detallePedido.cantidad
            ? EstadoDetallePedido.EN_TRANSITO
            : EstadoDetallePedido.PARCIAL;

      return {
        entregaProductoId,
        cantidadDespachada,
        cantidadEntregada: esEntregaEnPlanta ? cantidadTotalDespachada : undefined, // solo se asigna si es entrega en planta
        observaciones: entregaProducto.observaciones,
        detallePedidoId: detallePedido.id,
        nuevoEstado: estado,
        cantidadTotalDespachada,
      };
    });
    return this.prisma.$transaction(async (tx) => {
      await Promise.all(
        validacionesPreparadas.map(async (val) => {
          const entregaProductoActualizado = await this.entregraProductoService.update(
            val.entregaProductoId,
            {
              cantidadDespachada: val.cantidadDespachada,
              cantidadEntregada: val.cantidadEntregada,
              observaciones: val.observaciones,
            },
            tx
          );

          await this.detallePedidoService.update(
            val.detallePedidoId,
            {
              cantidadDespachada: val.cantidadTotalDespachada,
              cantidadEntregada: val.cantidadEntregada,
              estado: val.nuevoEstado,
            },
            tx
          );

          return entregaProductoActualizado;
        })
      );

      return await this.update(
        entrega.id,
        {
          estado: EstadoEntrega.EN_TRANSITO,
        },
        tx
      );

    }, { timeout: 20000 } );
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
  async completarEntrega({ entregaId, entregaProductos }: CompletarEntregaDto): Promise<Entrega> {
    this.logger.log(`Finalizando entrega con id ${entregaId}`);
    this.logger.log('entregaProductos', entregaProductos);

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
      detallePedido.cantidadEntregada = cantidadTotalEntregadoDetallePedido;
      if (!detallePedido) {
        throw new NotFoundException(`Detalle de pedido con id ${detallePedidoId} no encontrado`);
      }
      if (cantidadTotalEntregadoDetallePedido > detallePedido.cantidad) {
        throw new BadRequestException(`La cantidad entregada (${cantidadTotalEntregadoDetallePedido})
          supera la cantidad total (${detallePedido.cantidad}) en el detalle de pedido con id ${detallePedidoId}`);
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
      const esPedidoEntregadoCompleto = this.detallePedidoService.esCantidadTotalEntregada(detallesPedidoActualizados);
      if (esPedidoEntregadoCompleto) {
        await this.pedidoService.update(entrega.pedidoId, {
          estado: EstadoPedido.ENTREGADO
        }, tx);
      }
      return entregaFinalizada;
    }, { timeout: 20000 });
  }

  async cancelarEntrega(id: string): Promise<Entrega> {
    const entrega = await this.prisma.entrega.findUnique({
      where: { id },
      select: {
        id: true,
        estado: true,
        pedidoId: true,
        entregaProductos: {
          select: {
            id: true,
            detallePedidoId: true,
            cantidadDespachada: true,
            detallePedido: {
              select: {
                id: true,
                estado: true,
                cantidadDespachada: true,
              }
            }
          }
        }
      }
    });
    if (!entrega) {
      throw new NotFoundException(`Entrega con id ${id} no encontrada`);
    }
    if (entrega.estado === EstadoEntrega.CANCELADO) {
      throw new BadRequestException(`La entrega con id ${id} ya está cancelada`);
    }
    if (entrega.estado === EstadoEntrega.ENTREGADO) {
      throw new BadRequestException(`La entrega con id ${id} ya está entregada`);
    }
    const detallesPedidoRoolback = entrega.entregaProductos.map(({ detallePedidoId, cantidadDespachada }) => {
      const detallePedido = entrega.entregaProductos.find(ep => ep.detallePedidoId === detallePedidoId);
      if (!detallePedido) {
        throw new NotFoundException(`Detalle de pedido con id ${detallePedidoId} no encontrado`);
      }
      const cantidadTotalDespachada = detallePedido.detallePedido.cantidadDespachada - cantidadDespachada;
      if (cantidadTotalDespachada < 0) {
        throw new BadRequestException(`La cantidad despachada (${cantidadTotalDespachada}) no puede ser menor a 0`);
      }
      const estado = cantidadTotalDespachada === 0 ? EstadoDetallePedido.PENDIENTE : EstadoDetallePedido.PARCIAL;
      return {
        detallePedidoId,
        cantidadTotalDespachada,
        estado,
      };
    })

    return this.prisma.$transaction(async (tx) => {
      await Promise.all(
        detallesPedidoRoolback.map(async ({ detallePedidoId, cantidadTotalDespachada, estado }) => {
          await this.detallePedidoService.update(detallePedidoId, {
            cantidadDespachada: cantidadTotalDespachada,
            estado,
          }, tx);
        })
      );
      return await tx.entrega.update({
        where: { id },
        data: {
          estado: EstadoEntrega.CANCELADO,
        },
      });
    }, { timeout: 20000 });
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
