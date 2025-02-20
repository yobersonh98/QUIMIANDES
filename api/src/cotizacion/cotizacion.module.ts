import { Module } from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';
import { CotizacionController } from './cotizacion.controller';

@Module({
  controllers: [CotizacionController],
  providers: [CotizacionService],
})
export class CotizacionModule {}
