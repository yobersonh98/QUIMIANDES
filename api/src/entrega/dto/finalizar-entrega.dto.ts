import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from "class-validator";

export class FinalizarEntregaProductoDto {
  @IsString()
  @IsNotEmpty()
  entregaProductoId: string;

  @IsString()
  @IsNotEmpty()
  detallePedidoId: string;

  @IsString()
  observaciones?: string;

  @IsNumber()
  @Min(0)
  cantidadEntregada: number;
}

export class CompletarEntregaDto {
  @IsString()
  @IsNotEmpty()
  entregaId: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => FinalizarEntregaProductoDto)
  entregaProductos: FinalizarEntregaProductoDto[];
}