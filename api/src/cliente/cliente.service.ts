import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    return this.prisma.cliente.findMany({
      where: {
        nombre: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
    });
  }

  async findOneByDocumento(documento: string) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { documento },
      include: {
        inventarios: { include: { producto: true } },
        pedidos: { include: { productos: true } },
        cotizaciones: { include: { detalles: { include: { producto: true } } } },
      },
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

  async create(createClienteDto: CreateClienteDto) {
    const { documento, inventarios = [], pedidos = [], cotizaciones = [] } = createClienteDto;

    const existingCliente = await this.prisma.cliente.findUnique({ where: { documento } });
    if (existingCliente) throw new BadRequestException('El cliente ya existe');

    // Validar productos en inventarios
    if (inventarios.length > 0) {
      const productosIds = inventarios.map(inv => inv.productoId);
      const productosExistentes = await this.prisma.producto.findMany({
        where: { id: { in: productosIds } },
        select: { id: true },
      });
      const productosValidos = new Set(productosExistentes.map(p => p.id));
      if (inventarios.some(inv => !productosValidos.has(inv.productoId))) {
        throw new BadRequestException('Algunos productos en inventario no existen');
      }
    }

    return this.prisma.cliente.create({
      data: {
        ...createClienteDto,
        inventarios: inventarios.length > 0 ? { create: inventarios } : undefined,
        pedidos: pedidos.length > 0 ? {
          create: pedidos.map(pedido => ({
            fechaRequerimiento: new Date(pedido.fechaRequerimiento),
            estado: pedido.estado,
            observaciones: pedido.observaciones,
            fechaEntrega: pedido.fechaEntrega ? new Date(pedido.fechaEntrega) : null,
            pesoDespachado: pedido.pesoDespachado ?? null,
          })),
        } : undefined,
        cotizaciones: cotizaciones.length > 0 ? { create: cotizaciones.map(cot => ({ fecha: new Date(), total: cot.total })) } : undefined,
      },
      include: { inventarios: true, pedidos: true, cotizaciones: true },
    });
  }
}
