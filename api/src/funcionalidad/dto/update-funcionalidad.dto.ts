import { PartialType } from "@nestjs/mapped-types";
import { CreateFuncionalidadDto } from "./create-funcionalidad.dto";

export class UpdateFuncionalidadDto  extends PartialType(CreateFuncionalidadDto) {
  id?:string
}