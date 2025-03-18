import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { DetallePedidoModule } from './../detalle-pedido/detalle-pedido.module';

@Module({
  imports: [DetallePedidoModule],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
