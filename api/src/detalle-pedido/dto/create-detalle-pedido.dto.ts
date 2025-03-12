import { IsString, IsInt, IsNumber, isString, IsDateString, IsOptional } from 'class-validator';

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

  @IsNumber()
  total: number;

  @IsString()
  idLugarEntrega: string;

  @IsString()
  tipoEntrega: string;

  @IsDateString()
  fechaRequerimiento: Date;
}
