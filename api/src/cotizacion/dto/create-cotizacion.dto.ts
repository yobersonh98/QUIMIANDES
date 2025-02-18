import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateDetalleCotizacionDto {
  @IsString()
  @IsNotEmpty()
  productoId: string;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  precioUnitario: number;

  @IsNumber()
  subtotal: number;
}

export class CreateCotizacionDto {
  @IsString()
  @IsNotEmpty()
  clienteDocumento: string;

  @IsNumber()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleCotizacionDto)
  detalles: CreateDetalleCotizacionDto[];
}
