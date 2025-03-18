import { TipoEntregaProducto } from '@prisma/client';
import { IsString, IsInt, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateDetallePedidoDto {
  @IsString()
  @IsOptional()
  pedidoId: string;

  @IsString()
  productoId: string;

  @IsInt()
  unidades: number;

  @IsNumber()
  cantidad: number;

  @IsString()
  lugarEntregaId: string;

  @IsString()
  tipoEntrega: TipoEntregaProducto;

  @IsDateString()
  @IsOptional()
  fechaEntrega?: Date

  @IsString()
  @IsOptional()
  remision?: string
}
