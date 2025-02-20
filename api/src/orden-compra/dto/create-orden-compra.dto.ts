import { IsString, IsInt, IsOptional, IsDate } from 'class-validator';

export class CreateOrdenCompraDto {
  @IsString()
  pedidoId: string;

  @IsString()
  numeroOrden: string;

  @IsDate()
  fechaRequerimiento: Date;

  @IsInt()
  tiempoEntrega: number;

  @IsInt()
  pesoDespachado: number;

  @IsOptional()
  @IsString()
  remision?: string;
}
