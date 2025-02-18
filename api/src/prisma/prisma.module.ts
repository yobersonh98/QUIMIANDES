import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 🔥 Esto hace que el módulo sea global
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Se exporta para que esté disponible en otros módulos
})
export class PrismaModule {}
