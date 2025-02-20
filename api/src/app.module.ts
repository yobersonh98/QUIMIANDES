import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ClienteModule } from './cliente/cliente.module';
import { CotizacionModule } from './cotizacion/cotizacion.module';
import { PrismaModule } from './prisma/prisma.module';
import { PedidoModule } from './pedido/pedido.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { ProductoModule } from './producto/producto.module';
import { InventarioClienteModule } from './inventario-cliente/inventario-cliente.module';
import { DetalleCotizacionModule } from './detalle-cotizacion/detalle-cotizacion.module';
import { DetallePedidoModule } from './detalle-pedido/detalle-pedido.module';
import { EntregaModule } from './entrega/entrega.module';
import { OrdenCompraModule } from './orden-compra/orden-compra.module';

@Module({
  imports: [UserModule, AuthModule, ConfigModule.forRoot(), ClienteModule, CotizacionModule, PrismaModule, PedidoModule, ProveedorModule, ProductoModule, InventarioClienteModule, DetalleCotizacionModule, DetallePedidoModule, EntregaModule, OrdenCompraModule],
  controllers: [AppController],
  exports: [PrismaModule],
  providers: [AppService],
})
export class AppModule {}
