import { Injectable } from "@nestjs/common";
import { PrismaService } from "./../prisma/prisma.service";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaTransacction } from "./../common/types";

@Injectable()
export class PedidoDatasource {
  constructor(
    private prisma: PrismaService
  ) { }

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
  async  update(id:string, data:Prisma.PedidoUpdateInput, tx:PrismaTransacction = this.prisma) {
    return tx.pedido.update({
      where: { id},
      data
    })
  }
}