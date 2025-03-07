import { UnidadMedida } from '@prisma/client';
import { Proveedor } from '../../proveedor/entities/proveedor.entity';
import { Presentacion } from '../../presentacion/entities/presentacion.entity';


export class Producto {
  id: string;
  nombre: string;
  tipo: string;
  unidadMedida: UnidadMedida;
  pesoVolumen: number;
  precioBase: number;
  presentacion?: Presentacion;
  proveedor?: Proveedor;
  idPresentacion: string;
  idProveedor: string;

  nombrePresentacion?: string;
  nombreProveedor?: string;
}


