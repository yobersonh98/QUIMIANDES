import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from './../common/dtos/pagination.dto';
import { PrismaGenericPaginationService } from './../prisma/prisma-generic-pagination.service';
import { IdGeneratorService } from './../services/IdGeneratorService';
import { esVacio } from './../common/utils/string.util';
import { PrismaTransacction } from './../common/types';

@Injectable()
export class PedidoService {
  private logger = new Logger(PedidoService.name)
  constructor(
    private readonly prisma: PrismaService,
    private paginationService: PrismaGenericPaginationService,
    private idGeneratorService: IdGeneratorService,
  ) { }
  async create({ detallesPedido, ...infoPedido }: CreatePedidoDto) {
    const response  = await this.prisma.$transaction(async (prisma) => {
      try {
        const pedidoId = await this.idGeneratorService.generarIdPedido();
        const pedido = await prisma.pedido.create({
          data: {
            id: pedidoId,
            ...infoPedido,
          }
        });
        const detallesPedidoConId = this.idGeneratorService.mapearDetallesPedidoConIdsEnCreacion(pedidoId, detallesPedido);

        const detallesPedidoSaved = await prisma.detallePedido.createMany({
          data:detallesPedidoConId
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
    }, {timeout: 20000 })
    return response;
  }

  async findAll(findAllPeiddosDto: PaginationDto) {
    const response = await this.paginationService.paginate('Pedido', {
      select: {
        id: true,
        estado: true,
        cliente: {
          select: {
            nombre: true
          }
        },
        fechaRecibido: true,
        idCliente: true,
        ordenCompra: true,
      },
      orderBy: {
        fechaRecibido: 'desc'
      }
    }, findAllPeiddosDto);
    return response
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
        entregas: true,
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
    const { estado, pesoDespachado, fechaEntrega, observaciones, ordenCompra, detallesPedido=[] } = updatePedidoDto;
    const pedido = await tx.pedido.update({
      where: { id },
      data: {
        estado,
        pesoDespachado,
        fechaEntrega,
        observaciones,
        ordenCompra,
      },
    });
    await Promise.all(
      detallesPedido.map(dp =>
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
    return pedido
  }

  async remove(id: string) {
    return await this.prisma.pedido.delete({
      where: { id },
    });
  }
}
