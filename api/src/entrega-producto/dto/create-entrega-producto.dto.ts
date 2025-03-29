import { IsDate, IsDateString, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateEntregaProductoDto {
  @IsString()
  @IsOptional()
  entregaId:   string
  @IsString()
  detallePedidoId: string
  @IsNumber()
  cantidadDespachada: number 
  @IsDateString()
  @IsOptional()
  fechaEntrega   ?: string

  @IsOptional()
  @IsString()
  observaciones    ?:  string
}
