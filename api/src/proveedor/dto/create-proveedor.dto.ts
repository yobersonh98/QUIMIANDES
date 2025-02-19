import { IsString } from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  documento: string;

  @IsString()
  tipoDocumento: string;

  @IsString()
  nombre: string;

  @IsString()
  direccion: string;
}
