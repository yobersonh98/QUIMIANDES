import { IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateDetallePedidoDto } from '../../detalle-pedido/dto/create-detalle-pedido.dto';

export class CreatePedidoDto {
  @IsString()
  idCliente: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsDate()
  fechaRequerimiento: Date;

  @IsOptional()
  @IsDate()
  fechaEntrega?: Date;

  @IsOptional()
  @IsInt()
  tiempoEntrega?: number;

  @IsOptional()
  @IsNumber()
  pesoDespachado?: number;

  detallesPedido: CreateDetallePedidoDto[]

}
