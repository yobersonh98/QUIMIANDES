import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import {  Prisma } from '@prisma/client';
import { ClienteListarDto } from './dto/cliente-listar.dto';
import { PrismaGenericPaginationService } from './../prisma/prisma-generic-pagination.service';

@Injectable()
export class ClienteService {
  constructor(private readonly prisma: PrismaService, private prismaPagination: PrismaGenericPaginationService) {}

  async findAll(findAllDto: ClienteListarDto) {
    const { search } = findAllDto;
    const whereInput: Prisma.ClienteWhereInput = {
      nombre: search ? { contains: search, mode: 'insensitive' } : undefined,
    }
    return this.prismaPagination.paginate('Cliente', { where: whereInput }, findAllDto);
  }

  async search(search: string) {
    const clientes = await this.prisma.cliente.findMany({
      where: {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { documento: { contains: search, mode: 'insensitive' } },
        ],
      },
      select: { id: true, nombre: true, documento: true },
    })
    return clientes;
  }

  async findOneByDocumento(documento: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { documento },
      include: {
        inventarios: { include: { producto: true } },
        cotizaciones: { include: { detalles: { include: { producto: true } } } },
      },
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

  async findOneById(id: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: {
        lugaresEntrega: {
          where: { activo: true },
          include: { ciudad: true },
        },
        municipio: true,
      },
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }
  async create(createClienteDto: CreateClienteDto) {
    const { documento, lugaresEntrega=[] } = createClienteDto;

    const existingCliente = await this.prisma.cliente.findUnique({ where: { documento } });
    if (existingCliente) throw new BadRequestException('El cliente ya existe');

    return this.prisma.cliente.create({
      data: {
        ...createClienteDto,
        lugaresEntrega: lugaresEntrega.length > 0 ? { create: lugaresEntrega } : undefined,
      },
      include: { inventarios: true, pedidos: true, cotizaciones: true },
    });
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const {
      documento,
      nombre,
      direccion,
      estado,
      tipoDocumento,
      idMunicipio,
      email,
      contactoPrincipal,
      telefono,
      contactoPagos,
      telefonoPagos,
      zonaBarrio,
      lugaresEntrega,
      idLugaresEntregaEliminar,
    } = updateClienteDto;
  
    const lugaresEntregaAcrear = lugaresEntrega.filter((lugar) => !lugar.id);
  
    return this.prisma.$transaction(async (prisma) => {
      if (idLugaresEntregaEliminar && idLugaresEntregaEliminar.length > 0) {
        await prisma.lugarEntrega.updateMany({
          where: { id: { in: idLugaresEntregaEliminar } },
          data: { activo: false },
        });
      }

      return prisma.cliente.update({
        where: { id },
        data: {
          documento,
          nombre,
          direccion,
          estado,
          tipoDocumento,
          idMunicipio,
          email,
          contactoPrincipal,
          telefono,
          contactoPagos,
          telefonoPagos,
          zonaBarrio,
          lugaresEntrega: {
            createMany: lugaresEntregaAcrear.length
              ? { data: lugaresEntregaAcrear }
              : undefined, // Evitar error si no hay nuevos lugares de entrega
          },
        },
      });
    });
  }
  
}
