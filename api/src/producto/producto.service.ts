import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Prisma, Producto } from '@prisma/client';
import { PrismaGenericPaginationService } from './../prisma/prisma-generic-pagination.service';
import { PaginationResponse } from './../common/interfaces/IPaginationResponse';

@Injectable()
export class ProductoService {
  constructor(private readonly prisma: PrismaService, private paginationService: PrismaGenericPaginationService) { }

  async create(createProductoDto: CreateProductoDto) {
    return await this.prisma.producto.create({
      data: createProductoDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const where: Prisma.ProductoWhereInput = {
      nombre: {
        contains: paginationDto.search,
        mode: 'insensitive',
      },
    }

    return this.paginationService.paginate('Producto', {
      where, select: {
        id: true,
        nombre: true,
        precioBase: true,
        unidadMedida: true,
        proveedor: {
          select: {
            id: true,
            nombre: true,
          }
        },
        presentacion: true,
      }
    }, paginationDto);

  }

  async search(search: string) {
    return await this.prisma.producto.findMany({
      select: {
        id: true,
        nombre: true,
        unidadMedida: true,
        pesoVolumen: true,
      },
      where: {
        OR: [
          {
            nombre: {
              contains: search || '',
              mode: 'insensitive',
            },
          },
          {
            id: {
              contains: search || '',
              mode: 'insensitive'
            }
          }
        ]
      },
      take: 50
    });
  }

  async findOne(id: string) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      include: { proveedor: true, presentacion: true },
    });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: string, updateProductoDto: UpdateProductoDto) {
    return await this.prisma.producto.update({
      where: { id },
      data: updateProductoDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.producto.delete({
      where: { id },
    });
  }
}
