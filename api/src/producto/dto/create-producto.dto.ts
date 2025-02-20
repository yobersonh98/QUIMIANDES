import { IsString, IsNumber } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  tipo: string;

  @IsString()
  unidadMedida: string;

  @IsNumber()
  pesoVolumen: number;

  @IsNumber()
  precioBase: number;

  @IsString()
  proveedorDocumento: string;
}
