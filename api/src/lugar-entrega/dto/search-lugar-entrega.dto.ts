import { IsOptional, IsString } from "class-validator";

export class SearchLugarEntregaDto {

  @IsOptional()
  @IsString()
  search?: string;

  @IsString()
  @IsOptional()
  idCliente: string;
}