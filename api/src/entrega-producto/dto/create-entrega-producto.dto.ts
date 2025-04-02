import { Transform } from "class-transformer"
import { IsDate, IsDateString, IsNumber, IsNumberString, IsOptional, IsString, Min } from "class-validator"

export class CreateEntregaProductoDto {
  @IsString()
  @IsOptional()
  entregaId:   string

  @IsString()
  detallePedidoId: string

  @IsNumber()
  @Min(1)
  cantidadDespachada: number 

  @IsDateString()
  @IsOptional()
  fechaEntrega   ?: string

  @IsOptional()
  @IsString()
  observaciones    ?:  string
}
