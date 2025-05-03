import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Pagination, PaginationDto } from '../common/dtos/pagination.dto';
import { Prisma } from '@prisma/client';
import { PaginationResponse } from './../common/interfaces/IPaginationResponse';

type PrismaModels = Prisma.TypeMap['model'];
type PrismaModel = keyof PrismaModels;

type ModelFindManyArgs<T extends PrismaModel> = 
  Prisma.TypeMap['model'][T]['operations']['findMany']['args'];

type ModelFindManyResult<T extends PrismaModel> = 
  Prisma.TypeMap['model'][T]['operations']['findMany']['result'][0];

// DTO de entrada del método simplificado
interface PaginateOptions<T extends PrismaModel> {
  model: T;
  args: Omit<ModelFindManyArgs<T>, 'skip' | 'take'>;
  pagination: PaginationDto;
}

@Injectable()
export class PrismaGenericPaginationService {
  constructor(private readonly prisma: PrismaService) {}

  async paginateGeneric<T extends PrismaModel>(
    options: PaginateOptions<T>
  ): Promise<PaginationResponse<ModelFindManyResult<T>[]>> {
    const { model, args, pagination } = options;
    const paginationInstance = new Pagination(pagination);
    const prismaModel = this.prisma[model as keyof PrismaService];
  
    const count = await (prismaModel as any).count({
      where: (args as any).where,
    });
  
    const data = (await (prismaModel as any).findMany({
      ...args,
      skip: paginationInstance.offset,
      take: paginationInstance.limit,
    }));
  
    return paginationInstance.paginationResponse(count, data);
  }


  /**
   * Este metodo genera paginacion automatica con prisma, con unos errores de tipado, se recomienda para nuevas implemntaciones usar paginateGeneric();
   * @param model 
   * @param args 
   * @param paginationDto 
   * @returns 
   * @deprecated
   */
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