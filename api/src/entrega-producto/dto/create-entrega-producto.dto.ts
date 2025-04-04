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
  @IsOptional()
  cantidadDespachada: number 


  @IsNumber()
  @Min(1)
  cantidadDespachar: number 

  @IsDateString()
  @IsOptional()
  fechaEntrega   ?: string

  @IsOptional()
  @IsString()
  observaciones    ?:  string
}
