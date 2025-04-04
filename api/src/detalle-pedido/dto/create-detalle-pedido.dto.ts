import { TipoEntregaProducto } from '@prisma/client';
import { IsString, IsInt, IsNumber, IsDateString, IsOptional, IsNotEmpty, Min } from 'class-validator';

export class CreateDetallePedidoDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  pedidoId: string;

  @IsString()
  @IsNotEmpty()
  productoId: string;

  @IsNumber({
  })
  @IsOptional()
  unidades?: number;

  @IsNumber()
  @Min(1)
  cantidad: number;

  @IsString()
  lugarEntregaId: string;

  @IsString()
  @IsNotEmpty()
  tipoEntrega: TipoEntregaProducto;

  @IsDateString()
  @IsOptional()
  fechaEntrega?: Date

  @IsString()
  @IsOptional()
  remision?: string
}
