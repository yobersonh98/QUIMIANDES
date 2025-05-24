import { Module } from '@nestjs/common';
import { EntregaService } from './entrega.service';
import { EntregaController } from './entrega.controller';
import { EntregaProductoModule } from './../entrega-producto/entrega-producto.module';
import { DetallePedidoService } from './../detalle-pedido/detalle-pedido.service';
import { PedidoDocumentoService } from './../pedido-documento/pedido-documento.service';
import { PedidoDatasource } from './../pedido/pedido.datasource';

@Module({
  imports:[EntregaProductoModule],
  controllers: [EntregaController],
  providers: [EntregaService, DetallePedidoService, PedidoDocumentoService, PedidoDatasource],
  exports: [EntregaService, DetallePedidoService,PedidoDatasource]
})
export class EntregaModule {}
