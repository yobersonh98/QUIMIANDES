import { PartialType } from '@nestjs/mapped-types';
import { CreateDetallePedidoDto } from './create-detalle-pedido.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EstadoDetallePedido } from '@prisma/client';

export class UpdateDetallePedidoDto extends PartialType(CreateDetallePedidoDto) {
  @IsString()
  @IsOptional()
  id?: string
  
  @IsNumber()
  cantidadDespachada?: number

  @IsNumber()
  cantidadEntregada?: number

  @IsEnum(EstadoDetallePedido)
  estado?: EstadoDetallePedido
}
