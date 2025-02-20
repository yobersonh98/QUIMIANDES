import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDetalleCotizacionDto } from './dto/create-detalle-cotizacion.dto';
import { UpdateDetalleCotizacionDto } from './dto/update-detalle-cotizacion.dto';

@Injectable()
export class DetalleCotizacionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDetalleCotizacionDto: CreateDetalleCotizacionDto) {
    return await this.prisma.detalleCotizacion.create({
      data: createDetalleCotizacionDto,
    });
  }

  async findAll() {
    return await this.prisma.detalleCotizacion.findMany({
      include: { cotizacion: true, producto: true },
    });
  }

  async findOne(id: string) {
    const detalle = await this.prisma.detalleCotizacion.findUnique({
      where: { id },
      include: { cotizacion: true, producto: true },
    });
    if (!detalle) {
      throw new NotFoundException(`DetalleCotizacion con id ${id} no encontrado`);
    }
    return detalle;
  }

  async update(id: string, updateDetalleCotizacionDto: UpdateDetalleCotizacionDto) {
    return await this.prisma.detalleCotizacion.update({
      where: { id },
      data: updateDetalleCotizacionDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.detalleCotizacion.delete({
      where: { id },
    });
  }
}
