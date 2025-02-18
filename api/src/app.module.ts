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

@Module({
  imports: [UserModule, AuthModule, ConfigModule.forRoot(), ClienteModule, CotizacionModule, PrismaModule, PedidoModule],
  controllers: [AppController],
  exports: [PrismaModule],
  providers: [AppService],
})
export class AppModule {}
