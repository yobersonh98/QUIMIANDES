import { IsString, IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDetalleCotizacionDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID de la cotización' })
  @IsString()
  cotizacionId: string;

  @ApiProperty({ example: 'a7d8f6b2-12c3-4e5f-9abc-d1e2f3g4h5i6', description: 'ID del producto' })
  @IsString()
  productoId: string;

  @ApiProperty({ example: 5, description: 'Cantidad del producto' })
  @IsInt()
  cantidad: number;

  @ApiProperty({ example: 150.75, description: 'Precio unitario del producto' })
  @IsNumber()
  precioUnitario: number;

  @ApiProperty({ example: 753.75, description: 'Subtotal del producto en la cotización' })
  @IsNumber()
  subtotal: number;
}
