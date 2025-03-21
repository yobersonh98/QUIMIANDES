import { Module } from '@nestjs/common';
import { EntregaService } from './entrega.service';
import { EntregaController } from './entrega.controller';
import { EntregaProductoModule } from './../entrega-producto/entrega-producto.module';

@Module({
  imports:[EntregaProductoModule],
  controllers: [EntregaController],
  providers: [EntregaService],
})
export class EntregaModule {}
