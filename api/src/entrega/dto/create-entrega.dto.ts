import { IsString, IsOptional, ValidateNested, IsArray, IsDateString } from 'class-validator';
import { CreateEntregaProductoDto } from '../../entrega-producto/dto/create-entrega-producto.dto';
import { Type } from 'class-transformer';

export class CreateEntregaDto {

  @IsDateString()
  fechaEntrega: Date;

  
  @IsString()
  pedidoId: string;

  @IsOptional()
  @IsString()
  vehiculoInterno?: string;

  @IsOptional()
  @IsString()
  vehiculoExterno?: string;

  @IsString()
  entregadoPorA?: string;

  @IsOptional()
  @IsString()
  remision?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional() // ✅ Hace que detallesPedido sea opcional
  @IsArray() // ✅ Asegura que sea un array
  @ValidateNested({ each: true }) // ✅ Valida cada elemento dentro del array
  @Type(() => CreateEntregaProductoDto) // ✅ Transforma los datos al tipo esperado
  entregasProducto?: CreateEntregaProductoDto[]
}
