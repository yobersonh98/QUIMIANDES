import { Module } from '@nestjs/common';
import { LugarEntregaService } from './lugar-entrega.service';
import { LugarEntregaController } from './lugar-entrega.controller';

@Module({
  controllers: [LugarEntregaController],
  providers: [LugarEntregaService],
})
export class LugarEntregaModule {}
