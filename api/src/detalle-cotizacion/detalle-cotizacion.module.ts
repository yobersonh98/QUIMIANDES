import { Module } from '@nestjs/common';
import { DetalleCotizacionService } from './detalle-cotizacion.service';
import { DetalleCotizacionController } from './detalle-cotizacion.controller';

@Module({
  controllers: [DetalleCotizacionController],
  providers: [DetalleCotizacionService],
})
export class DetalleCotizacionModule {}
