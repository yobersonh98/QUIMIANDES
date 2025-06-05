import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { UpdateEntregaDto } from './dto/update-entrega.dto';
import { EntregaProductoService } from './../entrega-producto/entrega-producto.service';
import { DetallePedidoService } from './../detalle-pedido/detalle-pedido.service';
import { Entrega, EstadoDetallePedido, EstadoEntrega, EstadoPedido, TipoEntregaProducto, TipoOperacion } from '@prisma/client';
import { RegistrarDespachoDetallePedidoDto } from './../entrega-producto/dto/registrar-despacho-detalle-pedido.dto';
import { CompletarEntregaDto } from './dto/finalizar-entrega.dto';
import { PrismaTransacction } from './../common/types';
import { ListarEntregasDto } from './dto/listar-entregas.dto';
import { getEnumValueOrUndefined } from './../common/utils/string.util';
import { PrismaGenericPaginationService } from './../prisma/prisma-generic-pagination.service';
import { PaginationResponse } from './../common/interfaces/IPaginationResponse';
import { EntregaListadoItem } from './entities/entrega-listado-item';
import { isEmpty } from 'class-validator';
import { PedidoDatasource } from './../pedido/pedido.datasource';
import { AuditoriaLogService } from './../auditoria-log/auditoria-log.service';

@Injectable()
export class EntregaService {
  private logger = new Logger(EntregaService.name);
  constructor(private readonly prisma: PrismaService,
    private readonly entregraProductoService: EntregaProductoService,
    private readonly detallePedidoService: DetallePedidoService,
    private readonly prismaGenericPagination: PrismaGenericPaginationService,
    private readonly pedidoDatasource: PedidoDatasource,
    private auditService:AuditoriaLogService
  ) { }

  async programarEntrega(createEntregaDto: CreateEntregaDto, validar = true): Promise<Entrega> {
    const { pedidoId, vehiculoExterno, vehiculoInterno, remision, entregadoPorA, observaciones, entregasProducto, fechaEntrega } = createEntregaDto;
    if (isEmpty(entregasProducto) && validar) {
      throw new BadRequestException('No se han registrado productos para la entrega');
    }
    const pedido = await this.pedidoDatasource.findOneBasicInfo(pedidoId);
    if (!pedido && validar) {
      throw new NotFoundException(`Pedido con id ${pedidoId} no encontrado`);
    }
    if (validar && (pedido.estado === EstadoPedido.CANCELADO || pedido.estado === EstadoPedido.ENTREGADO)) {
      throw new BadRequestException('El pedido ha sido Cancelado o Entregado, no se puede registrar más entregas.')
    }
    const detallesPedido = validar ? await this.detallePedidoService.findAll(pedidoId): [];
    const detallesPedidoAModificarCantidadProgramada = entregasProducto.map(i => {
      if (!validar) {
        return {
          detallePedidoId:i.detallePedidoId,
          cantidadProgramada: i.cantidadDespachar
        }
      }
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

    const respuesta = await this.prisma.$transaction(async (tx) => {
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

      if (!validar || pedido?.estado === EstadoPedido.PENDIENTE) {
        await this.pedidoDatasource.update(pedidoId, {
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
    await this.auditService.log({
      usuarioId:createEntregaDto.usuarioId,
      accion: 'programarEntrega',
      entidad: 'Entrega',
      modulo: 'Entregas', 
      entidadId: respuesta.id,
      descripcion: 'Ha programado una nueva entrega con código ' + respuesta.codigo,
      valoresNuevos: createEntregaDto,
      tipoOperacion: TipoOperacion.CREAR
    })
    return respuesta
  }

  /**
   *  Confirma el despacho de entrega de un pedido. Actualiza el estado de los detalles de pedido y la entrega.
   * @param RegistrarDespachoDetallePedidoDto dto de despacho de entrega
   * @param entregaId id de la entrega
   * @param despachosEntregaProducto lista de despachos de entrega
   * @returns  entrega actualizada
   */
  async confirmarEntrega({ entregaId, despachosEntregaProducto, remision, observaciones, usuarioId }: RegistrarDespachoDetallePedidoDto): Promise<Entrega> {
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
      const esEntregaCompleta = cantidadTotalDespachada >= detallePedido.cantidad;

      let nuevoEstado: EstadoDetallePedido;

      if (esEntregaEnPlanta) {
        nuevoEstado = esEntregaCompleta
          ? EstadoDetallePedido.ENTREGADO
          : EstadoDetallePedido.PARCIAL;
      } else {
        nuevoEstado = EstadoDetallePedido.EN_TRANSITO;
      }

      return {
        entregaProductoId,
        cantidadDespachada,
        cantidadEntregada: esEntregaEnPlanta ? cantidadTotalDespachada : undefined,
        observaciones: entregaProducto.observaciones,
        detallePedidoId: detallePedido.id,
        nuevoEstado,
        cantidadTotalDespachada,
      };
    });

      
    const entregaSaved = await this.prisma.$transaction(async (tx) => {
      await Promise.all(
        validacionesPreparadas.map(async (val) => {
          await this.entregraProductoService.update(
            val.entregaProductoId,
            {
              cantidadDespachada: val.cantidadDespachada,
              cantidadEntregada: val.cantidadEntregada,
              observaciones: val.observaciones,
            },
            tx
          );

          await this.detallePedidoService.actualizarConValidacion(
            val.detallePedidoId,
            {
              cantidadDespachada: val.cantidadTotalDespachada,
              cantidadEntregada: val.cantidadEntregada,
              estado: val.nuevoEstado,
            },
            true
          );
        })
      );
      const todosEntregaEnPlanta = validacionesPreparadas.every((val) => {
        const detalle = detallesPedido.find(dp => dp.id === val.detallePedidoId);
        return detalle?.tipoEntrega === TipoEntregaProducto.RECOGE_EN_PLANTA;
      });

      const estadoEntregaFinal = todosEntregaEnPlanta
        ? EstadoEntrega.ENTREGADO
        : EstadoEntrega.EN_TRANSITO;
      // Lógica para actualizar el estado general de la entrega
      return await this.update(
        entrega.id,
        {
          estado: estadoEntregaFinal,
          remision,
          observaciones,
        },
        tx
      );
    }, { timeout: this.prisma.TimeToWait });
    const cantidadEntregados = await this.detallePedidoService.contarDetallesPedidoSinFinalizar(entrega.pedidoId)
    if (!cantidadEntregados) {
      await this.pedidoDatasource.update(entrega.pedidoId, { estado: 'ENTREGADO' })
    }
    await this.auditService.log({
      accion: 'confirmarEntrega',
      entidad: 'Entrega',
      modulo: 'Entregas',
      entidadId: entrega.id,
      descripcion: 'Se ha confirmado el despacho de la entrega ' + entrega.codigo,
      tipoOperacion: TipoOperacion.ACTUALIZAR,
      valoresAnteriores: entrega,
      valoresNuevos: entregaSaved,
      usuarioId
    })
    return entregaSaved
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
  async completarEntrega({ entregaId, entregaProductos, observaciones, usuarioId }: CompletarEntregaDto): Promise<Entrega> {
    const entrega = await this.prisma.entrega.findUnique({
      where: { id: entregaId },
    });

    if (!entrega) {
      throw new NotFoundException(`Entrega con id ${entregaId} no encontrada`);
    }

    const detallesPedido = await this.detallePedidoService.findAll(entrega.pedidoId);

    for (const { detallePedidoId, cantidadEntregada } of entregaProductos) {
      const detalle = detallesPedido.find(dp => dp.id === detallePedidoId);

      if (!detalle) {
        throw new NotFoundException(`Detalle de pedido con id ${detallePedidoId} no encontrado`);
      }

      if (([EstadoDetallePedido.ENTREGADO, EstadoDetallePedido.CANCELADO] as EstadoDetallePedido[]).includes(detalle.estado)) {
        throw new BadRequestException(`Detalle de pedido con id ${detallePedidoId} ya está en estado entregado o cancelado`);
      }

      const nuevaCantidadEntregada = detalle.cantidadEntregada + cantidadEntregada;
      detalle.cantidadEntregada = nuevaCantidadEntregada;

      detalle.estado = nuevaCantidadEntregada >= detalle.cantidad
        ? EstadoDetallePedido.ENTREGADO
        : EstadoDetallePedido.PARCIAL;
    }

    // ✅ Aquí evalúas TODOS los productos del pedido (no solo los que llegaron en esta entrega)
    const esPedidoEntregadoCompleto = detallesPedido.every(
      (detalle) => detalle.estado === EstadoDetallePedido.ENTREGADO
    );
    const response = await this.prisma.$transaction(async (tx) => {
      await Promise.all(
        detallesPedido.map(async (detalle) => {
          await this.detallePedidoService.update(detalle.id, {
            cantidadEntregada: detalle.cantidadEntregada,
            estado: detalle.estado,
          }, tx);
        })
      );

      const entregaFinalizada = await tx.entrega.update({
        where: { id: entregaId },
        data: {
          estado: EstadoPedido.ENTREGADO,
          observaciones,
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

      if (esPedidoEntregadoCompleto) {
        await this.pedidoDatasource.update(entrega.pedidoId, {
          estado: EstadoPedido.ENTREGADO
        }, tx);
      }

      return entregaFinalizada;
    }, { timeout: this.prisma.TimeToWait });
    await this.auditService.log({
      accion: 'completarEntrega',
      entidad: 'Entrega',
      modulo: 'Entregas',
      entidadId: entregaId,
      descripcion: 'Se ha entregado al cliente la entrega ' + entrega.codigo,
      tipoOperacion: TipoOperacion.ACTUALIZAR,
      valoresAnteriores: entrega,
      valoresNuevos: response,
      usuarioId
    })
    return response;
  }


  async cancelarEntrega(usuarioId:string, id: string): Promise<Entrega> {
    const entrega = await this.prisma.entrega.findUnique({
      where: { id },
      select: {
        id: true,
        estado: true,
        pedidoId: true,
        codigo: true,
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

    const respuesta = await this.prisma.$transaction(async (tx) => {
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
    await this.auditService.log({
      usuarioId,
      entidad: 'Entrega',
      tipoOperacion: TipoOperacion.CANCELAR,
      descripcion: 'Se ha cancelado la entrega con código ' + entrega.codigo,
      modulo: 'Entregas',
      accion: 'cancelarEntrega'
    })
    return respuesta;
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
                  direccion:true,
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
