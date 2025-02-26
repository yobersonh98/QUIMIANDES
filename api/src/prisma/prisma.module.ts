import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaGenericPaginationService } from './prisma-generic-pagination.service';

@Global() // 🔥 Esto hace que el módulo sea global
@Module({
  providers: [PrismaService, PrismaGenericPaginationService],
  exports: [PrismaService, PrismaGenericPaginationService], // Se exporta para que esté disponible en otros módulos
})
export class PrismaModule {}
