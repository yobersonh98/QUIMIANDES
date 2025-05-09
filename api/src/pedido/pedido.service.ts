import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaGenericPaginationService } from './../prisma/prisma-generic-pagination.service';
import { IdGeneratorService } from './../services/IdGeneratorService';
import { getEnumValueOrUndefined } from './../common/utils/string.util';
import { PrismaTransacction } from './../common/types';
import { ListarPedidoDto } from './dto/listar-pedido.dto';
import { EstadoPedido, Prisma } from '@prisma/client';
import { PedidoDocumentoService } from './../pedido-documento/pedido-documento.service';
import { CreateDetallePedidoDto } from './../detalle-pedido/dto/create-detalle-pedido.dto';

@Injectable()
export class PedidoService {
  private logger = new Logger(PedidoService.name)
  constructor(
    private readonly prisma: PrismaService,
    private paginationService: PrismaGenericPaginationService,
    private idGeneratorService: IdGeneratorService,
    private pedidoDocumentoService: PedidoDocumentoService
  ) { }
  async create({ detallesPedido, pedidoDocumentoIds, ...infoPedido }: CreatePedidoDto) {
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
            }
          }
        });
        const detallesPedidoConId = this.idGeneratorService.mapearDetallesPedidoConIdsEnCreacion(pedido.id, detallesPedido);

        const detallesPedidoSaved = await prisma.detallePedido.createMany({
          data: detallesPedidoConId
        })
        return {
          ...pedido,
          detallesPedido: detallesPedidoSaved,
        };
      } catch (error) {
        this.logger.error(error)
        throw new BadRequestException("Error al crear el pedido")
      } finally {
      }
    }, { timeout: this.prisma.TimeToWait })
    return response;
  }

  /**
   * Función para listar los pedidos paginados
   * @param listarPedidoDto dto para listar los pedidos
   * @returns  retorna un objeto con los pedidos paginados
   */
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
              nombre: true
            }
          },
          fechaRecibido: true,
          idCliente: true,
          detallesPedido: {
            select: {
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
    })
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
  findOneBasicInfo(id: string) {
    return this.prisma.pedido.findUnique({
      where: { id },
      select: {
        id: true,
        estado: true,
        fechaRecibido: true,
        idCliente: true,
        ordenCompra: true,
      }
    });
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
            lugarEntregaId: dp.lugarEntregaId,
            unidades: dp.unidades
          }
        })
      )
    );

    const filterDetallesPedidosUnd = detallesPedido.filter(dp => !dp.id)
    await this.pedidoDocumentoService.crearMuchos(pedido.id, pedidoDocumentoIds)
    const destallesPedidosParaCrear: CreateDetallePedidoDto[] = filterDetallesPedidosUnd.map(dp => ({ pedidoId: pedido.id, productoId: dp.productoId, tipoEntrega: dp.tipoEntrega, cantidad: dp.cantidad, fechaEntrega: dp.fechaEntrega, lugarEntregaId: dp.lugarEntregaId, unidades: dp.unidades }))
    const detallesPedidoConId = this.idGeneratorService.mapearDetallesPedidoConIdsEnCreacion(id, destallesPedidosParaCrear);

    const detallesPedidoSaved = await tx.detallePedido.createMany({
      data: detallesPedidoConId
    })
    return pedido
  }

  async finalizarEntregaPedido(id: string, tx: PrismaTransacction = this.prisma) {
    const pedido = await this.prisma.pedido.findUnique({
      where: {
        id,
        estado: {
          in: ['EN_PROCESO']
        }
      },
      include: {
        detallesPedido: true,
      }
    });
    if (!pedido) {
      throw new NotFoundException(`El pedido con ID ${id} no existe o no está en estado EN_PROCESO`);
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
        detallesPedido: true
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
    const isSomeDetallePedidoEntregado = pedido.detallesPedido.some(detalle => detalle.estado === 'ENTREGADO');
    if (isSomeDetallePedidoEntregado) {
      throw new BadRequestException(`No se puede cancelar el pedido con ID ${id} porque tiene detalles entregados, debe marcarlo como entregado`);
    }
    await this.prisma.detallePedido.updateMany({
      where: {
        pedidoId: id,
        estado: {
          in: ['PENDIENTE']
        }
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

}
