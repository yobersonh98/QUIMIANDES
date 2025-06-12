
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateFuncionalidadDto } from "./dto/create-funcionalidad.dto";
import { UpdateFuncionalidadDto } from "./dto/update-funcionalidad.dto";
import { PaginationDto } from "./../common/dtos/pagination.dto";
import { PrismaGenericPaginationService } from "./../prisma/prisma-generic-pagination.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class FuncionalidadService {
  constructor(private prisma: PrismaService,
    private pagination: PrismaGenericPaginationService
  ) {

  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const whereInput: Prisma.FuncionalidadWhereInput = {
        nombre: paginationDto.search ? { contains: paginationDto.search, mode: 'insensitive' } : undefined,
      }
      return this.pagination.paginateGeneric({
        model: 'Funcionalidad',
        pagination: paginationDto,
        args: {
          where: whereInput
        }
      })
    } catch (error) {
      throw new BadRequestException('Error fetching all records.');
    }
  }

  async findOne(id: string) {
    const Funcionalidad = await this.prisma.funcionalidad.findUnique({ where: { id } });
    if (!Funcionalidad) {
      throw new NotFoundException(`Funcionalidad with id ${id} not found`);
    }
    return Funcionalidad
  }

  async create(data: CreateFuncionalidadDto) {
    const Funcionalidad = await this.prisma.funcionalidad.create({ data });
    return Funcionalidad
  }

  async update(id: string, data: UpdateFuncionalidadDto) {
    const Funcionalidad = await this.prisma.funcionalidad.update({ where: { id }, data });
    return Funcionalidad
  } 

  async delete(id: string) {
    try {
      const Funcionalidad = await this.prisma.funcionalidad.delete({ where: { id } });
      return Funcionalidad
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Funcionalidad with id ${id} not found for deletion`);
      }
      throw new BadRequestException('Error deleting record.');
    }
  }
}
