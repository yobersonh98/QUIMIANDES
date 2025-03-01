import { TipoDocumento } from '@prisma/client';
import { IsBoolean, IsOptional, IsString, Validate, ValidateIf } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  documento: string;

  @IsString(
    { message: 'El tipo de documento debe ser una cadena de texto' },
  )
  @ValidateIf((object, value) => value in TipoDocumento)
  tipoDocumento: TipoDocumento;

  @IsString()
  nombre: string;

  @IsString()
  direccion: string;

  @IsBoolean()
  @IsOptional()
  facturaIva: boolean;
}
