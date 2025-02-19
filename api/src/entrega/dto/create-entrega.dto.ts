import { IsString, IsOptional } from 'class-validator';

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
  lugarEntrega: string;

  @IsString()
  tipoEntrega: string;

  @IsOptional()
  @IsString()
  remision?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
