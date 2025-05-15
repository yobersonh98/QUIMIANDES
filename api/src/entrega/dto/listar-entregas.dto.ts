import { EstadoEntrega } from "@prisma/client";
import { PaginationDto } from "../../common/dtos/pagination.dto";
import { IsDateString, IsOptional, IsString } from "class-validator";

export class ListarEntregasDto extends PaginationDto {
  @IsString()
  @IsOptional()
  estado?: EstadoEntrega

  @IsOptional()
  @IsString()
  pedidoId:string

  @IsDateString()
  @IsOptional()
  fechaInicio?: string

  @IsDateString()
  @IsOptional()
  fechaFin?: string
}