import { IsString, IsInt, IsNumber } from 'class-validator';

export class CreateDetallePedidoDto {
  @IsString()
  pedidoId: string;

  @IsString()
  productoId: string;

  @IsInt()
  unidades: number;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  total: number;
}
