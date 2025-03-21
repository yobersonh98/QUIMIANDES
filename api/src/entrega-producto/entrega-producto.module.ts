import { Module } from '@nestjs/common';
import { EntregaProductoService } from './entrega-producto.service';
import { EntregaProductoController } from './entrega-producto.controller';

@Module({
  controllers: [EntregaProductoController],
  providers: [EntregaProductoService],
  exports: [EntregaProductoService]
})
export class EntregaProductoModule {}
