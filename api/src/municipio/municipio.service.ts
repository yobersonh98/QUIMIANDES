import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class MunicipioService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    return this.prisma.municipio.findMany({
      where: {
        nombre: {
          contains: search || '', // Busca coincidencias parciales en el nombre
          mode: 'insensitive', // Ignora mayúsculas y minúsculas
        },
      },
      take: 30, // Limita la consulta a 20 resultados
    });
  }
}
