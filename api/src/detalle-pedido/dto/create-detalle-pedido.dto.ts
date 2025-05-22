import { TipoEntregaProducto } from '@prisma/client';
import { 
  IsString, 
  IsNumber, 
  IsDateString, 
  IsOptional, 
  IsNotEmpty, 
  Min, 
  IsPositive,
  IsEnum 
} from 'class-validator';

export class CreateDetallePedidoDto {
  @IsString({ message: 'Por favor ingrese un código de pedido válido' })
  @IsOptional()
  @IsNotEmpty({ message: 'El código de pedido no puede estar vacío' })
  pedidoId?: string;

  @IsString({ message: 'Por favor seleccione un producto de la lista' })
  @IsNotEmpty({ message: 'Debe seleccionar un producto para continuar' })
  productoId: string;

  @IsNumber({}, { message: 'Las unidades deben ser un número válido' })
  @IsOptional()
  @Min(0, { message: 'Las unidades no pueden ser negativas' })
  unidades?: number;

  @IsNumber({}, { message: 'Ingrese una cantidad válida' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  cantidad: number;

  @IsNumber({}, { message: 'Ingrese un peso válido' })
  @IsPositive({ message: 'El peso debe ser mayor a cero' })
  pesoTotal: number;

  @IsString({ message: 'Seleccione un lugar de entrega válido' })
  @IsNotEmpty({ message: 'Debe seleccionar un lugar de entrega' })
  lugarEntregaId: string;

  @IsString({ message: 'Seleccione un tipo de entrega válido' })
  @IsNotEmpty({ message: 'Debe elegir cómo recibirá el pedido' })
  @IsEnum(TipoEntregaProducto, { 
    message: `Elija una opción válida: ${Object.values(TipoEntregaProducto).join(', ')}` 
  })
  tipoEntrega: TipoEntregaProducto;

  @IsDateString({}, { message: 'Ingrese una fecha válida (DD/MM/AAAA)' })
  @IsOptional()
  fechaEntrega?: Date;

  @IsString({ message: 'Ingrese un número de remisión válido' })
  @IsOptional()
  remision?: string;
}