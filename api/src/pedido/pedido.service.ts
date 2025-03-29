import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from './../common/dtos/pagination.dto';
import { PrismaGenericPaginationService } from './../prisma/prisma-generic-pagination.service';
import { IdGeneratorService } from './../services/IdGeneratorService';
import { DetallePedidoService } from './../detalle-pedido/detalle-pedido.service';

@Injectable()
export class PedidoService {
  constructor(private readonly prisma: PrismaService,
    private paginationService: PrismaGenericPaginationService,
    private idGeneratorService: IdGeneratorService,
    private detallePedidoService: DetallePedidoService,
  ) {}
  async create({detallesPedido, ...infoPedido}: CreatePedidoDto) {
    const pedidoId = await this.idGeneratorService.generarIdPedido();
    const pedido = await this.prisma.pedido.create({
      data: {
        id: pedidoId,
        ...infoPedido,
      }
    });
    const detallesPedidoSaved = [];
    if (detallesPedido && detallesPedido.length > 0) {
      for await(const detalle of detallesPedido) {
        detalle.pedidoId = pedidoId
        const detallePeido = await this.detallePedidoService.create(detalle);
        detallesPedidoSaved.push(detallePeido)
      }
    }
    return {
      ...pedido,
      detallesPedido
    }
  }

  async findAll(findAllPeiddosDto: PaginationDto){
    const response = await this.paginationService.paginate('Pedido',{
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
      }
    },findAllPeiddosDto);
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
              include:{
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

  async update(id: string, updatePedidoDto: UpdatePedidoDto) {
    const {estado, pesoDespachado, fechaEntrega, observaciones, ordenCompra, detallesPedido} = updatePedidoDto;
    const pedido =  await this.prisma.pedido.update({
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
        this.prisma.detallePedido.update({
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
