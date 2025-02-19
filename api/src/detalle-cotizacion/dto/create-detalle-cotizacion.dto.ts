import { IsString, IsInt, IsNumber } from 'class-validator';

export class CreateDetalleCotizacionDto {
  @IsString()
  cotizacionId: string;

  @IsString()
  productoId: string;

  @IsInt()
  cantidad: number;

  @IsNumber()
  precioUnitario: number;

  @IsNumber()
  subtotal: number;
}
