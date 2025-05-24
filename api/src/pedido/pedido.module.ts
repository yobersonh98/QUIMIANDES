import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { DetallePedidoModule } from './../detalle-pedido/detalle-pedido.module';
import { PedidoDocumentoService } from './../pedido-documento/pedido-documento.service';
import { PedidoDatasource } from './pedido.datasource';
import { EntregaService } from './../entrega/entrega.service';
import { EntregaModule } from './../entrega/entrega.module';

@Module({
  imports: [DetallePedidoModule, EntregaModule],
  controllers: [PedidoController],
  providers: [PedidoService, PedidoDocumentoService, PedidoDatasource],
  exports: [PedidoDatasource, PedidoService]
})
export class PedidoModule {}
