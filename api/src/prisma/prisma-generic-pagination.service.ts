import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Pagination, PaginationDto } from '../common/dtos/pagination.dto';
import { Prisma, PrismaClient } from '@prisma/client';

// Tipos para el contexto de Prisma
type PrismaModels = Prisma.TypeMap['model'];
type PrismaModel = keyof PrismaModels;

// Tipo para extraer los argumentos de FindMany para cada modelo
type ModelFindManyArgs<T extends PrismaModel> = 
  Prisma.TypeMap['model'][T]['operations']['findMany']['args'];

// Tipo para extraer el resultado de FindMany para cada modelo  
type ModelFindManyResult<T extends PrismaModel> = 
  Prisma.TypeMap['model'][T]['operations']['findMany']['result'];

@Injectable()
export class PrismaGenericPaginationService {
  constructor(private readonly prisma: PrismaService) {}

  async paginate<
    T extends PrismaModel,
    Args extends ModelFindManyArgs<T>,
    Result extends ModelFindManyResult<T>
  >(
    model: T,
    args: Omit<Args, 'skip' | 'take'>,
    paginationDto: PaginationDto
  ) {
    const pagination = new Pagination(paginationDto);
    
    // Corregimos el tipado aquí
    const prismaModel = this.prisma[model as keyof PrismaService];
    
    const count = await (prismaModel as any).count({
      where: (args as any).where
    });
    
    const data = await (prismaModel as any).findMany({
      ...args,
      skip: pagination.offset,
      take: pagination.limit,
    }) as Result[];
    
    return pagination.paginationResponse(count, data);
  }
}