import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class MunicipioService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    return this.prisma.municipio.findMany({
      where: {
        OR: [
          {
            nombre: {
              contains: search || '',
              mode: 'insensitive',
            }
          },
          {
            id: {
              contains: search || '',
              mode: 'insensitive'
            }
          }
        ]
      },
      take: 30,
    });
  }
}