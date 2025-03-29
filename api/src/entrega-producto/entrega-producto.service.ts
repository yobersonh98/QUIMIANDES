import { Injectable } from '@nestjs/common';
import { CreateEntregaProductoDto } from './dto/create-entrega-producto.dto';
import { UpdateEntregaProductoDto } from './dto/update-entrega-producto.dto';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class EntregaProductoService {
  constructor(private prisma: PrismaService){

  }
  create(createEntregaProductoDto: CreateEntregaProductoDto) {
    return this.prisma.entregaProducto.create({
      data:createEntregaProductoDto
    })
  }

  findAll(detallePedidoId:string) {
    return this.prisma.entregaProducto.findMany({
      where: {
        detallePedidoId,
      }
    })
  }

  findOne(id: string) {
    return this.prisma.entregaProducto.findUnique({
      where: {
        id,
      }
    })
  }

  update(id: string, updateEntregaProductoDto: UpdateEntregaProductoDto) {
    return this.prisma.entregaProducto.update({
      where: {
        id
      },
      data:updateEntregaProductoDto
    })
  }
  remove(id: string) {
    return `This action removes a #${id} entregaProducto`;
  }
}
