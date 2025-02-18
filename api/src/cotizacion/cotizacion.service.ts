import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto';

@Injectable()
export class CotizacionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCotizacionDto: CreateCotizacionDto) {
    const { clienteDocumento, total, detalles } = createCotizacionDto;

    // Verificar si el cliente existe
    const cliente = await this.prisma.cliente.findUnique({ where: { documento: clienteDocumento } });
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Validar productos en detalles
    const productosIds = detalles.map((detalle) => detalle.productoId);
    const productosExistentes = await this.prisma.producto.findMany({
      where: { id: { in: productosIds } },
      select: { id: true },
    });
    const productosValidos = new Set(productosExistentes.map((p) => p.id));

    if (detalles.some((detalle) => !productosValidos.has(detalle.productoId))) {
      throw new BadRequestException('Algunos productos en la cotización no existen');
    }

    return this.prisma.cotizacion.create({
      data: {
        clienteDocumento,
        total,
        detalles: {
          create: detalles.map((detalle) => ({
            productoId: detalle.productoId,
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precioUnitario,
            subtotal: detalle.subtotal,
          })),
        },
      },
      include: { detalles: true },
    });
  }

  async findAll() {
    return this.prisma.cotizacion.findMany({
      include: { detalles: true },
    });
  }

  async findOne(id: string) {
    const cotizacion = await this.prisma.cotizacion.findUnique({
      where: { id },
      include: { detalles: true },
    });

    if (!cotizacion) {
      throw new NotFoundException('Cotización no encontrada');
    }

    return cotizacion;
  }

  // async update(id: string, updateCotizacionDto: UpdateCotizacionDto) {
  //   const cotizacion = await this.prisma.cotizacion.findUnique({ where: { id } });

  //   if (!cotizacion) {
  //     throw new NotFoundException('Cotización no encontrada');
  //   }

  //   return this.prisma.cotizacion.update({
  //     where: { id },
  //     data: {
  //       'clienteDocumento': updateCotizacionDto.clienteDocumento,
  //       'total': updateCotizacionDto.total,
  //       ...updateCotizacionDto
  //     },
  //   });
  // }

  async remove(id: string) {
    const cotizacion = await this.prisma.cotizacion.findUnique({ where: { id } });

    if (!cotizacion) {
      throw new NotFoundException('Cotización no encontrada');
    }

    return this.prisma.cotizacion.delete({ where: { id } });
  }
}
