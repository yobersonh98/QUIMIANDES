import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaGenericPaginationService } from './../prisma/prisma-generic-pagination.service';
import { IdGeneratorService } from './../services/IdGeneratorService';
import { getEnumValueOrUndefined } from './../common/utils/string.util';
import { PrismaTransacction } from './../common/types';
import { ListarPedidoDto } from './dto/listar-pedido.dto';
import { EstadoPedido, TipoEntregaProducto } from '@prisma/client';
import { PedidoDocumentoService } from './../pedido-documento/pedido-documento.service';
import { CreateDetallePedidoDto } from './../detalle-pedido/dto/create-detalle-pedido.dto';
import { isEmpty } from 'class-validator';
import { groupBy } from './../common/utils/lists.util';
import { CreateEntregaDto } from './../entrega/dto/create-entrega.dto';
import { EntregaService } from './../entrega/entrega.service';

@Injectable()
export class PedidoService {
  private logger = new Logger(PedidoService.name)
  constructor(
    private readonly prisma: PrismaService,
    private paginationService: PrismaGenericPaginationService,
    private idGeneratorService: IdGeneratorService,
    private pedidoDocumentoService: PedidoDocumentoService,
    private entregaService:EntregaService,
  ) { }
  async create({ detallesPedido, pedidoDocumentoIds, ...infoPedido }: CreatePedidoDto) {
    let entregasACrear: CreateEntregaDto[]= []

    const response = await this.prisma.$transaction(async (prisma) => {
      try {
        const pedido = await prisma.pedido.create({
          data: {
            ...infoPedido,
            pedidoDocumentos: {
              createMany: {
                data: pedidoDocumentoIds?.map(documentoId => ({
                  documentoId
                }))
              }
            },
          }
        });
        const detallesPedidoConId = this.idGeneratorService.mapearDetallesPedidoConIdsEnCreacion(pedido.id, detallesPedido);

        const detallesPedidoSaved = await prisma.detallePedido.createMany({
          data: detallesPedidoConId
        })
        const detallesPedidoConTipoEntregaEnPlanta = detallesPedidoConId.filter(i => i.tipoEntrega === TipoEntregaProducto.RECOGE_EN_PLANTA);
        if (!isEmpty(detallesPedidoConTipoEntregaEnPlanta)) {
          const detallesPedidosAgrupadosPorFechaEntrega = groupBy(detallesPedidoConTipoEntregaEnPlanta, 'fechaEntrega')
          for (const [fechaEntrega, detalles] of Object.entries(detallesPedidosAgrupadosPorFechaEntrega)) {
            entregasACrear.push({
              fechaEntrega: new Date(fechaEntrega),
              pedidoId: pedido.id,
              entregasProducto:  detalles.map((dtp)=> ({
                cantidadDespachar: dtp.cantidad,
                detallePedidoId: dtp.id,
              }))
            })
          }
        }

        return {
          ...pedido,
          detallesPedido: detallesPedidoSaved,
        };
      } catch (error) {
        this.logger.error(error)
        throw new BadRequestException("Error al crear el pedido")
      }
    }, { timeout: this.prisma.TimeToWait })
    try {
      await Promise.all(entregasACrear.map(async e=> await this.entregaService.programarEntrega(e, false)))
    } catch (error) {
      this.logger.warn('Error creando las entregas de los productos reocoje en planta.')
    }

    return response;
  }

  async findAll(listarPedidoDto: ListarPedidoDto) {
    const estado = getEnumValueOrUndefined(EstadoPedido, listarPedidoDto.estado);
    const response = await this.paginationService.paginateGeneric({
      model: 'Pedido',
      pagination: listarPedidoDto,
      args: {
        where: {
          estado,
          OR: [
            { cliente: { nombre: { contains: listarPedidoDto.search, mode: 'insensitive' } } },
            { id: { contains: listarPedidoDto.search, mode: 'insensitive' } },
            { ordenCompra: { contains: listarPedidoDto.search, mode: 'insensitive' } },
          ]
        },
        select: {
          id: true,
          estado: true,
          codigo: true,
          cliente: {
            select: {
              nombre: true,
              direccion: true
            }
          },
          fechaRecibido: true,
          idCliente: true,
          detallesPedido: {
            select: {
              id: true,
              codigo: true,
              estado: true,
              cantidad: true,
              cantidadDespachada: true,
              cantidadEntregada: true,
              fechaEntrega: true,
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  unidadMedida: true
                }
              },
              lugarEntrega: {
                select: {
                  nombre: true,
                  direccion: true,
                  ciudad: {
                    select: {
                      id: true,
                      nombre: true
                    }
                  }
                }
              }
            }
          },
          ordenCompra: true,
          _count: {
            select: {
              detallesPedido: true,
            }
          }
        },
        orderBy: {
          fechaRecibido: 'desc'
        }
      }
    });
    return response;
  }

  async findOne(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        cliente: true,
        detallesPedido: {
          include: {
            producto: true,
            lugarEntrega: {
              include: {
                ciudad: true,
              }
            },
            entregasDetallePedido: true,
          }
        },
        pedidoDocumentos: {
          select: {
            documentoId: true,
            documento: {
              select: {
                id: true,
                url: true,
                originalName: true,
                mimeType: true,
                size: true
              }
            }
          }
        },
        entregas: {
          orderBy: {
            fechaEntrega: 'asc'
          }
        },
      },
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return pedido;
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto, tx: PrismaTransacction = this.prisma) {
    const { estado, pesoDespachado, fechaEntrega, observaciones, ordenCompra, detallesPedido = [], pedidoDocumentoIds = [] } = updatePedidoDto;
    const pedido = await tx.pedido.update({
      where: { id },
      data: {
        estado,
        pesoDespachado,
        fechaEntrega,
        observaciones,
        ordenCompra
      },
    });
    this.logger.debug(updatePedidoDto)
    const filterDetallesPedidos = detallesPedido.filter(dp => dp.id !== undefined && dp.id !== null)
    await this.pedidoDocumentoService.crearMuchos(pedido.id, pedidoDocumentoIds)
    await Promise.all(
      filterDetallesPedidos.map(dp =>
        tx.detallePedido.update({
          where: { id: dp.id },
          data: {
            productoId: dp.productoId,
            tipoEntrega: dp.tipoEntrega,
            cantidad: dp.cantidad,
            fechaEntrega: dp.fechaEntrega,
            lugarEntregaId: dp.lugarEntregaId || undefined,
            unidades: dp.unidades,
            pesoTotal: dp.pesoTotal
          }
        })
      )
    );

    const filterDetallesPedidosUnd = detallesPedido.filter(dp => !dp.id)
    await this.pedidoDocumentoService.crearMuchos(pedido.id, pedidoDocumentoIds)
    const destallesPedidosParaCrear: CreateDetallePedidoDto[] = filterDetallesPedidosUnd.map(dp => ({ pedidoId: pedido.id, productoId: dp.productoId, tipoEntrega: dp.tipoEntrega, cantidad: dp.cantidad, fechaEntrega: dp.fechaEntrega, lugarEntregaId: dp.lugarEntregaId, unidades: dp.unidades, pesoTotal: dp.pesoTotal }))
    const detallesPedidoConId = this.idGeneratorService.mapearDetallesPedidoConIdsEnCreacion(id, destallesPedidosParaCrear);
    if (!isEmpty(updatePedidoDto.detallePedidoIdsEliminar)) {
      this.logger.debug(await this.eliminarMuchos(updatePedidoDto.detallePedidoIdsEliminar,tx))
    }
    await tx.detallePedido.createMany({
      data: detallesPedidoConId
    })
    return pedido
  }

  async finalizarEntregaPedido(id: string, tx: PrismaTransacction = this.prisma) {
    const hayAlgunaEntregaEnProceso = await tx.entrega.findFirst({
      where: {
        pedidoId: id,
        estado: {
          in: ["EN_TRANSITO", "PENDIENTE"]
        }
      }
    });

    if (hayAlgunaEntregaEnProceso) {
      throw new ConflictException(
        'Existen entregas en tránsito o pendientes. Por favor, finalízalas o cancélalas antes de cerrar el pedido.'
      );
    }

    const pedido = await this.prisma.pedido.findUnique({
      where: {
        id,
        estado: {
          in: ['EN_PROCESO']
        },
      },
      include: {
        detallesPedido: true,
      }
    });

    if (!pedido) {
      throw new NotFoundException(
        'El pedido no existe o no se encuentra en estado EN_PROCESO.'
      );
    }

    const hayDetallesPendientes = pedido.detallesPedido.find(detalle =>
      detalle.estado === 'PENDIENTE' || detalle.estado === 'EN_TRANSITO'
    );

    if (hayDetallesPendientes) {
      throw new ConflictException(
        'Este pedido aún tiene productos pendientes o en tránsito. Debes finalizar la entrega de todos los productos antes de cerrar el pedido.'
      );
    }

    const detallesPedido = pedido.detallesPedido.map(detalle => ({
      ...detalle,
      estado: 'ENTREGADO',
    }));
    await this.prisma.detallePedido.updateMany({
      where: {
        id: {
          in: detallesPedido.map(detalle => detalle.id)
        }
      },
      data: {
        estado: 'ENTREGADO'
      }
    });
    const pedidoActualizado = await this.update(id, {
      estado: 'ENTREGADO'
    }, tx);
    return pedidoActualizado;
  }

  async cancelarPedido(id: string, tx: PrismaTransacction = this.prisma) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        detallesPedido: true,
        entregas: true
      }
    });
    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    if (pedido.estado === 'CANCELADO') {
      throw new BadRequestException(`El pedido con ID ${id} ya está cancelado`);
    }
    if (pedido.estado === 'ENTREGADO') {
      throw new BadRequestException(`El pedido con ID ${id} ya está entregado`);
    }
    const todosLosProductosEstanEnPendiente = pedido.detallesPedido.every(dp => dp.estado === 'PENDIENTE');
    if (!todosLosProductosEstanEnPendiente) {
      throw new ConflictException('Todos los productos del pedido deberian estar en estado pediente.')
    }
    const hayAlgunaEntregaSinFinalizar = pedido.entregas.some(e => e.estado === 'PENDIENTE' || e.estado === 'EN_TRANSITO')
    if (hayAlgunaEntregaSinFinalizar) {
      throw new ConflictException('Hay entregas gestionadas para el pedido, debe finalizar o cancelar las entregas programadas del pedido.')
    }
    await this.prisma.detallePedido.updateMany({
      where: {
        pedidoId: id
      },
      data: {
        estado: 'CANCELADO'
      }
    })
    return this.update(id, {
      estado: 'CANCELADO'
    }, tx);

  }

  async remove(id: string) {
    const pedidoEliminado = await this.prisma.pedido.delete({
      where: { id, estado: 'PENDIENTE' }
    });
    if (!pedidoEliminado) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }
    return pedidoEliminado;

  }

/**
 * Elimina múltiples registros de detalles de pedido según una lista de IDs proporcionada.
 *
 * @param detallePedidoIds - Un arreglo de IDs de los detalles de pedido que se desean eliminar.
 * @param tx - (Opcional) Transacción Prisma para ejecutar la operación de manera transaccional. 
 *             Por defecto se usa la instancia principal de Prisma.
 *
 * @returns Una promesa que resuelve con el resultado de la operación `deleteMany`.
 * 
 * @throws BadRequestException si el arreglo de IDs está vacío.
 *
 * @example
 * await eliminarMuchos(['id1', 'id2'], tx);
 */
async eliminarMuchos(detallePedidoIds: string[], tx: PrismaTransacction = this.prisma) {
  this.logger.debug(detallePedidoIds)
  return tx.detallePedido.deleteMany({
    where: {
      id: {
        in: detallePedidoIds
      }
    }
  });
}

}
