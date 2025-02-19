import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleCotizacionDto } from './create-detalle-cotizacion.dto';

export class UpdateDetalleCotizacionDto extends PartialType(CreateDetalleCotizacionDto) {}
