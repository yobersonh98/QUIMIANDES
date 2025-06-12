
import { IsString, IsInt, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateFuncionalidadDto {

  @ApiProperty({ description: 'nombre of the Funcionalidad', example: 'example_string' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'descripcion of the Funcionalidad', example: 'example_value' })
  @IsOptional()
  descripcion: string;

  @ApiProperty({ description: 'ruta of the Funcionalidad', example: 'example_value' })
  @IsOptional()
  ruta: string;

  @ApiProperty({ description: 'activo of the Funcionalidad', example: 'true' })
  @IsBoolean()
  activo: boolean;

  @ApiProperty({ description: 'icon of the Funcionalidad', example: 'example_value' })
  @IsOptional()
  icon: string;

  @ApiProperty({ description: 'rolFuncionalidades of the Funcionalidad', example: 'example_value' })
  @IsOptional()
  rolFuncionalidades: any;

  @ApiProperty({ description: 'acciones of the Funcionalidad', example: 'example_value' })
  @IsOptional()
  acciones: any;

  @ApiProperty({ description: 'creadoEn of the Funcionalidad', example: 'example_value' })
  @IsOptional()
  creadoEn: Date;

  @ApiProperty({ description: 'actualizadoEn of the Funcionalidad', example: 'example_value' })
  @IsOptional()
  actualizadoEn: Date;
}
