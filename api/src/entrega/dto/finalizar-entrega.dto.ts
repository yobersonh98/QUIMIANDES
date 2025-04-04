import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from "class-validator";

export class FinalizarEntregaProductoDto {
  @IsString()
  @IsNotEmpty()
  entregaProductoId: string;

  @IsString()
  observaciones?: string;

  @IsNumber()
  @Min(0)
  cantidadEntregada: number;
}

export class FinalizarEntregaDto {
  @IsString()
  @IsNotEmpty()
  entregaId: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => FinalizarEntregaProductoDto)
  entregaProductos: FinalizarEntregaProductoDto[];
}