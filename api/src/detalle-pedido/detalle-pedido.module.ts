import { Module } from '@nestjs/common';
import { DetallePedidoService } from './detalle-pedido.service';
import { DetallePedidoController } from './detalle-pedido.controller';

@Module({
  controllers: [DetallePedidoController],
  providers: [DetallePedidoService],
  exports: [DetallePedidoService]
})
export class DetallePedidoModule {}
