import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleCotizacionDto } from './create-detalle-cotizacion.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDetalleCotizacionDto extends PartialType(CreateDetalleCotizacionDto) {
  @ApiProperty({ example: 10, description: 'Nueva cantidad del producto', required: false })
  cantidad?: number;

  @ApiProperty({ example: 200.50, description: 'Nuevo precio unitario del producto', required: false })
  precioUnitario?: number;
}