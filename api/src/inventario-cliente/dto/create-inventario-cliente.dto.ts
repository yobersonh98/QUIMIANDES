import { IsString, IsNumber } from 'class-validator';

export class CreateInventarioClienteDto {
  @IsString()
  clienteDocumento: string;

  @IsString()
  productoId: string;

  @IsNumber()
  precioEspecial: number;
}
