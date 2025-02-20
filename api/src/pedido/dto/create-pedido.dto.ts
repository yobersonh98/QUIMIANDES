import { IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePedidoDto {
  @IsString()
  clienteDocumento: string;

  @IsString()
  estado: string;

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
}
