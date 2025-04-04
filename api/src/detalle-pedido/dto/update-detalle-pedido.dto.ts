import { PartialType } from '@nestjs/mapped-types';
import { CreateDetallePedidoDto } from './create-detalle-pedido.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDetallePedidoDto extends PartialType(CreateDetallePedidoDto) {
  @IsString()
  @IsOptional()
  id?: string
  
  @IsNumber()
  cantidadDespachada: number
}
