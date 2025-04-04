import { Module } from '@nestjs/common';
import { EntregaService } from './entrega.service';
import { EntregaController } from './entrega.controller';
import { EntregaProductoModule } from './../entrega-producto/entrega-producto.module';
import { DetallePedidoService } from './../detalle-pedido/detalle-pedido.service';
import { PedidoService } from './../pedido/pedido.service';

@Module({
  imports:[EntregaProductoModule],
  controllers: [EntregaController],
  providers: [EntregaService, DetallePedidoService, PedidoService],
})
export class EntregaModule {}
