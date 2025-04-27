import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { isEmpty } from 'class-validator';

@Injectable()
export class PedidoDocumentoService {
  private logger = new Logger(PedidoDocumentoService.name)
  constructor(
    private prisma: PrismaService
  ) { }

  async crearMuchos(pedidoId: string, documentoIds: string[]) {
    try {
      if (isEmpty(documentoIds)) {
        return;
      }
      const documentosCreados = await this.prisma.pedidoDocumento.findMany({
        where: {
          documentoId: {
            in: documentoIds
          },
          pedidoId,
        },
        select: {
          documentoId: true
        }
      })

      const documentosACrear = documentoIds.filter(id => {
        const documentoExistente = documentosCreados.find(i => i.documentoId === id);
        if (documentoExistente) return false;
        return true;
      })
      return await this.prisma.pedidoDocumento.createMany({
        data: documentosACrear.map(i => {
          return {
            documentoId: i,
            pedidoId
          }
        })
      })
    } catch (error) {
      this.logger.error(error)
    }
  }

}
