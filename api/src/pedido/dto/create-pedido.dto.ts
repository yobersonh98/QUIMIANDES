import { IsArray, IsDate, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateDetallePedidoDto } from '../../detalle-pedido/dto/create-detalle-pedido.dto';
import { Type } from 'class-transformer';

export class CreatePedidoDto {
  @IsString()
  @IsNotEmpty()
  idCliente: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsDateString()
  fechaRecibido?: Date;

  @IsOptional()
  @IsDate()
  fechaEntrega?: Date;

  @IsOptional()
  @IsInt()
  tiempoEntrega?: number;

  @IsOptional()
  @IsNumber()
  pesoDespachado?: number;

  @IsString()
  @IsOptional()
  ordenCompra?: string


  @IsOptional() // ✅ Hace que detallesPedido sea opcional
  @IsArray() // ✅ Asegura que sea un array
  @ValidateNested({ each: true }) // ✅ Valida cada elemento dentro del array
  @Type(() => CreateDetallePedidoDto) // ✅ Transforma los datos al tipo esperado
  detallesPedido?: CreateDetallePedidoDto[];

  @IsOptional()
  @IsArray()
  pedidoDocumentoIds?: string[]
  
  usuarioId?:string
}
