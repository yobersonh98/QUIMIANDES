import { PartialType } from '@nestjs/swagger';
import { CreateEntregaProductoDto } from './create-entrega-producto.dto';

export class UpdateEntregaProductoDto extends PartialType(CreateEntregaProductoDto) {}
