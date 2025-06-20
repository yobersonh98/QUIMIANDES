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
import { MunicipioModule } from './municipio/municipio.module';
import { LugarEntregaModule } from './lugar-entrega/lugar-entrega.module';
import { validateEnv } from './config';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { PresentacionModule } from './presentacion/presentacion.module';
import { ServicesModule } from './services/services.module';
import { EntregaProductoModule } from './entrega-producto/entrega-producto.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DocumentModule } from './document/document.module';
import { PedidoDocumentoService } from './pedido-documento/pedido-documento.service';
import { AuditoriaLogModule } from './auditoria-log/auditoria-log.module';
@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ClienteModule,
    CotizacionModule,
    PrismaModule,
    PedidoModule,
    ProveedorModule,
    ProductoModule,
    InventarioClienteModule,
    DetalleCotizacionModule,
    DetallePedidoModule,
    EntregaModule,
    OrdenCompraModule,
    MunicipioModule,
    LugarEntregaModule,
    PresentacionModule,
    ServicesModule,
    EntregaProductoModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    DocumentModule,
    AuditoriaLogModule
  ],
  controllers: [AppController],
  exports: [PrismaModule, AuditoriaLogModule],
  providers: [AppService,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard
    },
    PedidoDocumentoService
  ],
})
export class AppModule { }
