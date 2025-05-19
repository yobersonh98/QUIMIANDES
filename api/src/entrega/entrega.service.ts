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
import { IdGeneratorService } from './../services/IdGeneratorService';
import { ListarEntregasDto } from './dto/listar-entregas.dto';
import { getEnumValueOrUndefined } from './../common/utils/string.util';
import { PrismaGenericPaginationService } from './../prisma/prisma-generic-pagination.service';
import { PaginationResponse } from './../common/interfaces/IPaginationResponse';
import { EntregaListadoItem } from './entities/entrega-listado-item';
import { isEmpty } from 'class-validator';

@Injectable()
export class EntregaService {
  private logger = new Logger(EntregaService.name);
  constructor(private readonly prisma: PrismaService,
    private readonly entregraProductoService: EntregaProductoService,
    private readonly detallePedidoService: DetallePedidoService,
    private readonly pedidoService: PedidoService,
    private readonly idGeneratorService: IdGeneratorService,
    private readonly prismaGenericPagination: PrismaGenericPaginationService
  ) { }

  async create(createEntregaDto: CreateEntregaDto): Promise<Entrega> {
    const { pedidoId, vehiculoExterno, vehiculoInterno, remision, entregadoPorA, observaciones, entregasProducto, fechaEntrega } = createEntregaDto;
    if (isEmpty(entregasProducto)) {
      throw new BadRequestException('No se han registrado productos para la entrega');
    }
    const pedido = await this.pedidoService.findOneBasicInfo(pedidoId);
    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${pedidoId} no encontrado`);
    }
    if (pedido.estado === EstadoPedido.CANCELADO || pedido.estado === EstadoPedido.ENTREGADO) {
      throw new BadRequestException('El pedido ha sido Cancelado o Entregado, no se puede registrar más entregas.')
    }
    const detallesPedido = await this.detallePedidoService.findAll(pedidoId);
    const detallesPedidoAModificarCantidadProgramada = entregasProducto.map(i => {
      const detallePedido = detallesPedido.find(d => d.id === i.detallePedidoId)
      if (!this.detallePedidoService.puedeSerModificado(detallePedido)) {
        throw new BadRequestException(
          `No se puede programar la entrega porque uno o más productos se encuentran en estado ${EstadoDetallePedido.ENTREGADO} o ${EstadoDetallePedido.CANCELADO}.`
        );
      }
      return {
        detallePedidoId:detallePedido.id,
        cantidadProgramada:detallePedido.cantidadProgramada + i.cantidadDespachar
      }
    })

    return this.prisma.$transaction(async (tx) => {
      const entrega = await tx.entrega.create({
        data: {
          pedidoId,
          vehiculoExterno,
          vehiculoInterno,
          remision,
          entregadoPorA,
          observaciones,
          fechaEntrega,
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
          estado: EstadoPedido.EN_PROCESO,
        }, tx)
      }
      await Promise.all(detallesPedidoAModificarCantidadProgramada.map(async ep => {
        return await tx.detallePedido.update({
          where: {
            id: ep.detallePedidoId
          },
          data: {
            cantidadProgramada: ep.cantidadProgramada
          }
        })
      }))
      return entrega;
    },  { timeout: this.prisma.TimeToWait });
  }

  /**
   *  Confirma el despacho de entrega de un pedido. Actualiza el estado de los detalles de pedido y la entrega.
   * @param RegistrarDespachoDetallePedidoDto dto de despacho de entrega
   * @param entregaId id de la entrega
   * @param despachosEntregaProducto lista de despachos de entrega
   * @returns  entrega actualizada
   */
  async confirmarEntrega({ entregaId, despachosEntregaProducto, remision }: RegistrarDespachoDetallePedidoDto): Promise<Entrega> {
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

      const esEntregaEnPlanta = detallePedido.tipoEntrega === TipoEntregaProducto.RECOGE_EN_PLANTA;
      const estado =
        esEntregaEnPlanta
          ? EstadoDetallePedido.ENTREGADO
          : EstadoDetallePedido.EN_TRANSITO

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
          remision,
        },
        tx
      );

    }, { timeout: this.prisma.TimeToWait });
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

      if (detallePedido.estado == EstadoDetallePedido.ENTREGADO || detallePedido.estado == EstadoDetallePedido.CANCELADO) {
        throw new BadRequestException(`El detalle de pedido con id ${detallePedidoId} ya está en estado entregado o cancelado`);
      }
      if (cantidadTotalEntregadoDetallePedido >= detallePedido.cantidad) {
        detallePedido.estado = EstadoDetallePedido.ENTREGADO;
      } else {
        detallePedido.estado = EstadoDetallePedido.PARCIAL
      }
      return detallePedido
    })
    return this.prisma.$transaction(async (tx) => {
      await Promise.all(
        detallesPedidoActualizados.map(async (detallePedido) => {
          await this.detallePedidoService.update(detallePedido.id, {
            cantidadEntregada: detallePedido.cantidadEntregada,
            estado: detallePedido.estado,
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
    }, { timeout: this.prisma.TimeToWait });
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
            cantidadDespachar: true,
            detallePedido: {
              select: {
                id: true,
                estado: true,
                cantidadDespachada: true,
                cantidadEntregada: true,
                cantidadProgramada: true
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
    const detallesPedidoRoolback = entrega.entregaProductos.map(({ detallePedidoId, cantidadDespachada, cantidadDespachar}) => {
      const detallePedido = entrega.entregaProductos.find(ep => ep.detallePedidoId === detallePedidoId);
      if (!detallePedido) {
        throw new NotFoundException(`Detalle de pedido con id ${detallePedidoId} no encontrado`);
      }
      const cantidadTotalDespachada = detallePedido.detallePedido.cantidadDespachada - cantidadDespachada;
      const cantidadTotalProgramada = detallePedido.detallePedido.cantidadProgramada - cantidadDespachar;
      if (cantidadTotalDespachada < 0) {
        throw new BadRequestException(`La cantidad despachada (${cantidadTotalDespachada}) no puede ser menor a 0`);
      }
      const estado = cantidadTotalDespachada === 0 ? EstadoDetallePedido.PENDIENTE : undefined;
      return {
        detallePedidoId,
        cantidadTotalDespachada,
        cantidadTotalProgramada,
        estado,
      };
    })

    return this.prisma.$transaction(async (tx) => {
      await Promise.all(
        detallesPedidoRoolback.map(async ({ detallePedidoId, cantidadTotalDespachada, cantidadTotalProgramada, estado }) => {
          await this.detallePedidoService.update(detallePedidoId, {
            cantidadDespachada: cantidadTotalDespachada,
            estado,
            cantidadProgramada: cantidadTotalProgramada
          }, tx);
        })
      );
      return await tx.entrega.update({
        where: { id },
        data: {
          estado: EstadoEntrega.CANCELADO,
        },
      });
    }, { timeout: this.prisma.TimeToWait });
  }

  async findAll(dto: ListarEntregasDto): Promise<PaginationResponse<EntregaListadoItem[]>> {
    const estado = getEnumValueOrUndefined(EstadoEntrega, dto.estado);
    const response = await this.prismaGenericPagination.paginateGeneric({
      model: 'Entrega',
      args: {
        where: {
          estado,
          pedidoId: dto.pedidoId,
          fechaEntrega: {
            gte: dto.fechaInicio ? new Date(dto.fechaInicio) : undefined,
            lte: dto.fechaFin ? new Date(dto.fechaFin) : undefined,
          }
        },
        select: {
          id: true,
          estado: true,
          codigo:true,
          fechaCreacion: true,
          fechaEntrega: true,
          observaciones: true,
          entregadoPorA: true,
          remision: true,
          vehiculoExterno: true,
          vehiculoInterno: true,
          entregaProductos: {
            select: {
              id: true,
              cantidadDespachada: true,
              cantidadEntregada: true,
              cantidadDespachar: true,
              observaciones: true,
              detallePedido: {
                select: {
                  producto: {
                    select: {
                      id: true,
                      nombre: true,
                    }
                  },
                  lugarEntrega: {
                    select: {
                      id: true,
                      ciudad: true,
                      direccion: true,
                      nombre: true,
                    }
                  }
                }
              }
            }
          },
          pedidoId: true,
          pedido: {
            select: {
              cliente: {
                select: {
                  nombre: true,
                }
              },
              codigo: true,
            }
          },
          _count: {
            select: {
              'entregaProductos': true
            },
          }
        },
        orderBy: {
          fechaCreacion: 'desc'
        }
      },
      pagination: {
        ...dto,
        limit: dto.limit || 100
      }
    })
    const dataMaped: EntregaListadoItem[] = response.data.map(i => {
      const entrenga = i as any
      return {
        ...entrenga,
        cantidadProductos: entrenga?._count.entregaProductos,
        _count: undefined
      }
    })
    const responseData: PaginationResponse<EntregaListadoItem[]> = {
      data: dataMaped,
      meta: response.meta
    }
    return responseData
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
        codigo: true,
        observaciones: true,
        pedidoId: true,
        fechaEntrega: true,
        pedido: {
          select: {
            codigo:true,
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
                    direccion: true,
                    contacto: true,
                    telefonoEntregas: true,
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
