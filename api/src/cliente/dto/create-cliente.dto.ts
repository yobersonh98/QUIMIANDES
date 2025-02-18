import { IsString, IsOptional, IsArray, ValidateNested, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class CreateInventarioDto {
  @IsUUID()
  @IsNotEmpty()
  productoId: string;

  @IsNumber()
  @IsNotEmpty()
  precioEspecial: number;
}

class CreatePedidoDto {
  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsNotEmpty()
  fechaRequerimiento: Date;

  @IsOptional()
  fechaEntrega?: Date;

  @IsOptional()
  @IsNumber()
  pesoDespachado?: number;
}

class CreateCotizacionDto {
  @IsNumber()
  @IsNotEmpty()
  total: number;
}

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  documento: string;

  @IsString()
  @IsNotEmpty()
  tipoDocumento: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsOptional()
  @IsString()
  zonaBarrio?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInventarioDto)
  inventarios?: CreateInventarioDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoDto)
  pedidos?: CreatePedidoDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCotizacionDto)
  cotizaciones?: CreateCotizacionDto[];
}
