import { UnidadMedida } from '@prisma/client';
import { IsString, IsNumber } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  tipo: string;

  @IsString()
  unidadMedida: UnidadMedida;

  @IsNumber()
  pesoVolumen: number;

  @IsNumber()
  precioBase: number;

  @IsString()
  idProveedor: string;

  @IsString()
  idPresentacion: string;
}
