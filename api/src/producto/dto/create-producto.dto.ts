import { UnidadMedida } from '@prisma/client';
import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  tipo: string;

  @IsString()
  unidadMedida: UnidadMedida;

  @IsNumber()
  @IsPositive()
  pesoVolumen: number;

  @IsNumber()
  precioBase: number;

  @IsString()
  idProveedor: string;

  @IsString()
  idPresentacion: string;

  
}
