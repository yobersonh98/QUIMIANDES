import { Injectable } from '@nestjs/common';
import { CreateLugarEntregaDto } from './dto/create-lugar-entrega.dto';
import { UpdateLugarEntregaDto } from './dto/update-lugar-entrega.dto';
import { PrismaService } from './../prisma/prisma.service';
import { SearchLugarEntregaDto } from './dto/search-lugar-entrega.dto';

@Injectable()
export class LugarEntregaService {

  constructor (private prisma: PrismaService) {}
  create(createLugarEntregaDto: CreateLugarEntregaDto) {
    return 'This action adds a new lugarEntrega';
  }
  findAll(params: SearchLugarEntregaDto) {
    return this.prisma.lugarEntrega.findMany({
      where: { idCliente: params.idCliente, activo: true,
        OR: [
          { direccion: { contains: params.search, mode: 'insensitive' } },
          { nombre : { contains: params.search, mode: 'insensitive' } },
        ]
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} lugarEntrega`;
  }

  update(id: string, updateLugarEntregaDto: UpdateLugarEntregaDto) {
    return `This action updates a #${id} lugarEntrega`;
  }

  remove(id: string) {
    return this.prisma.lugarEntrega.update({
      where: { id },
      data: { activo: false },
    })
  }
}
