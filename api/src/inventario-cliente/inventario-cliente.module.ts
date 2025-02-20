import { Module } from '@nestjs/common';
import { InventarioClienteService } from './inventario-cliente.service';
import { InventarioClienteController } from './inventario-cliente.controller';

@Module({
  controllers: [InventarioClienteController],
  providers: [InventarioClienteService],
})
export class InventarioClienteModule {}
