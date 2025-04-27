import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { DetallePedidoModule } from './../detalle-pedido/detalle-pedido.module';
import { PedidoDocumentoService } from './../pedido-documento/pedido-documento.service';

@Module({
  imports: [DetallePedidoModule],
  controllers: [PedidoController],
  providers: [PedidoService, PedidoDocumentoService],
})
export class PedidoModule {}
