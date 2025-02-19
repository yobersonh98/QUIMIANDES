import { Cotizacion } from '../../cotizacion/entities/cotizacion.entity';
import { Producto } from '../../producto/entities/producto.entity';

export class DetalleCotizacion {
  id: string;
  cotizacion: Cotizacion;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
