import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from './../common/dtos/pagination.dto';
import { PrismaGenericPaginationService } from './../prisma/prisma-generic-pagination.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProveedorService {
  constructor(private readonly prisma: PrismaService, private paginationService: PrismaGenericPaginationService) { }

  async create(createProveedorDto: CreateProveedorDto) {
    return await this.prisma.proveedor.create({
      data: createProveedorDto,
    });
  }

  async findAll(findAllDto: PaginationDto) {
    const { search } = findAllDto;
    const whereInput: Prisma.ProveedorWhereInput = {
      nombre: search ? { contains: search, mode: 'insensitive' } : undefined,
    };
    return this.paginationService.paginate('Proveedor', { where: whereInput }, findAllDto);
  }

  async search(search: string) {
    return this.prisma.proveedor.findMany({
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
    });
  }

  async findOne(id: string) {
    const proveedor = await this.prisma.proveedor.findUnique({
      where: { id },
      include: { productos: true },
    });
    if (!proveedor) {
      throw new NotFoundException(`Proveedor con id ${id} no encontrado`);
    }
    return proveedor;
  }

  async update(id: string, updateProveedorDto: UpdateProveedorDto) {
    return await this.prisma.proveedor.update({
      where: { id },
      data: updateProveedorDto,
    });
  }

  async remove(id: string) {
    return await this.prisma.proveedor.delete({
      where: { id },
    });
  }
}
