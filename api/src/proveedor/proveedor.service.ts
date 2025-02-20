import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProveedorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProveedorDto: CreateProveedorDto) {
    return await this.prisma.proveedor.create({
      data: createProveedorDto,
    });
  }

  async findAll() {
    return await this.prisma.proveedor.findMany({
      include: { productos: true },
    });
  }

  async findOne(documento: string) {
    const proveedor = await this.prisma.proveedor.findUnique({
      where: { documento },
      include: { productos: true },
    });
    if (!proveedor) {
      throw new NotFoundException(`Proveedor con documento ${documento} no encontrado`);
    }
    return proveedor;
  }

  async update(documento: string, updateProveedorDto: UpdateProveedorDto) {
    return await this.prisma.proveedor.update({
      where: { documento },
      data: updateProveedorDto,
    });
  }

  async remove(documento: string) {
    return await this.prisma.proveedor.delete({
      where: { documento },
    });
  }
}
