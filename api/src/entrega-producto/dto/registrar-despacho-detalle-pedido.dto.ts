import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class RegistrarDespachoDetallePedidoDto {
  @IsString()
  entregaId: string;

  @IsString()
  @IsOptional()
  observaciones?:string

  @IsString()
  @IsOptional()
  remision?:string

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => DespachoDetallePedidoDto)
  despachosEntregaProducto: DespachoDetallePedidoDto[];

}

export class DespachoDetallePedidoDto {
  @IsString()
  @IsNotEmpty()
  entregaProductoId: string;

  @IsNumber()
  @Min(1)
  cantidadDespachada: number;

  @IsString()
  @IsOptional()
  observaciones?: string;
}