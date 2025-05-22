import { TipoEntregaProducto } from '@prisma/client';
import { IsString, IsInt, IsNumber, IsDateString, IsOptional, IsNotEmpty, Min, IsPositive } from 'class-validator';

export class CreateDetallePedidoDto {
  @IsString()
  @IsOptional()
  pedidoId: string;

  @IsString()
  @IsNotEmpty()
  productoId: string;

  @IsNumber()
  @IsOptional()
  unidades?: number;

  @IsNumber()
  @Min(1)
  @IsPositive()
  @IsNotEmpty()
  cantidad: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  pesoTotal: number;

  @IsString()
  @IsOptional()
  lugarEntregaId: string;

  @IsString()
  @IsNotEmpty()
  tipoEntrega: TipoEntregaProducto;

  @IsDateString()
  @IsNotEmpty()
  fechaEntrega?: Date

  @IsString()
  @IsOptional()
  remision?: string
}
