import { Injectable } from '@nestjs/common';
import { CreatePresentacionDto } from './dto/create-presentacion.dto';
import { UpdatePresentacionDto } from './dto/update-presentacion.dto';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class PresentacionService {
  constructor(
    private prisma: PrismaService
  ) { }
  create(createPresentacionDto: CreatePresentacionDto) {
    return 'This action adds a new presentacion';
  }

  findAll() {
    return this.prisma.presentacion.findMany();
  }

  search(search: string) {
    return this.prisma.presentacion.findMany({
      where: {
        OR: [
          {
            nombre: {
              contains: search || '',
              mode: 'insensitive'
            }
          },
          {
            id: {
              contains: search || '',
              mode: 'insensitive'
            }
          }
        ]
      }
    })
  }

  findOne(id: string) {
    return this.prisma.presentacion.findUnique({
      where: { id }
    })
  }

  update(id: string, updatePresentacionDto: UpdatePresentacionDto) {
    return this.prisma.presentacion.update({
      where: { id },
      data: updatePresentacionDto
    })
  }

  remove(id: string) {
    return this.prisma.presentacion.delete({
      where: { id }
    })
  }
}
