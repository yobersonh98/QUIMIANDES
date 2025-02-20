import { Cotizacion } from '../../cotizacion/entities/cotizacion.entity';
import { Producto } from '../../producto/entities/producto.entity';
import { ApiProperty } from '@nestjs/swagger';

export class DetalleCotizacion {
  @ApiProperty({ example: '1f4e6d8a-b5c3-4e2a-9abc-d1e2f3g4h5i6', description: 'ID del detalle de cotización' })
  id: string;

  @ApiProperty({ description: 'Cotización asociada al detalle' })
  cotizacion: Cotizacion;

  @ApiProperty({ description: 'Producto asociado al detalle' })
  producto: Producto;

  @ApiProperty({ example: 5, description: 'Cantidad del producto en la cotización' })
  cantidad: number;

  @ApiProperty({ example: 150.75, description: 'Precio unitario del producto' })
  precioUnitario: number;

  @ApiProperty({ example: 753.75, description: 'Subtotal calculado del producto' })
  subtotal: number;
}