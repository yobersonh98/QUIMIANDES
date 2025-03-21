import { IsString, IsOptional } from 'class-validator';
import { CreateEntregaProductoDto } from '../../entrega-producto/dto/create-entrega-producto.dto';

export class CreateEntregaDto {
  @IsString()
  pedidoId: string;

  @IsOptional()
  @IsString()
  vehiculoInterno?: string;

  @IsOptional()
  @IsString()
  vehiculoExterno?: string;

  @IsString()
  entregadoPorA: string;

  @IsString()
  lugarEntregaId: string;


  @IsOptional()
  @IsString()
  remision?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;


  entregasProducto?: CreateEntregaProductoDto[]
}
