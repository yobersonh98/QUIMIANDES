import { PartialType } from '@nestjs/swagger';
import { CreateEntregaProductoDto } from './create-entrega-producto.dto';
import { IsNumber } from 'class-validator';

export class UpdateEntregaProductoDto extends PartialType(CreateEntregaProductoDto) {
  @IsNumber()
  cantidadEntregada?: number;
}
