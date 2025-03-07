import { ProductoEntity } from '@/services/productos/entities/producto.entity';
import { ProductoService } from '@/services/productos/productos.service';
import React, { ReactNode } from 'react';

type Props = {
  id?: string;
  component: (producto: ProductoEntity) => ReactNode;
  mensajeNoId?: string;
  mensajeNoEncontrado?: string;
};

export default async function ConsultarProducto({
  id,
  component,
  mensajeNoId = "No se proporcionó un ID de producto",
  mensajeNoEncontrado = "No se encontró el producto solicitado"
}: Props) {
  // Caso 1: No se proporcionó un ID
  if (!id) {
    return (
      <div className="p-4 border rounded-md bg-yellow-50 text-yellow-800">
        <p className="font-medium">{mensajeNoId}</p>
      </div>
    );
  }

  try {
    // Intentar consultar el producto
    const resultado = await ProductoService.getInstance().consultar(id);
    
    // Caso 2: La consulta fue exitosa pero no hay datos
    if (!resultado.data) {
      return (
        <div className="p-4 border rounded-md bg-orange-50 text-orange-800">
          <p className="font-medium">{mensajeNoEncontrado}</p>
          <p className="text-sm mt-1">ID consultado: {id}</p>
        </div>
      );
    }
    
    // Caso 3: Producto encontrado, renderizar el componente
    return component(resultado.data);
    
  } catch (error) {
    // Caso 4: Error durante la consulta
    return (
      <div className="p-4 border rounded-md bg-red-50 text-red-800">
        <p className="font-medium">Error al consultar el producto</p>
        <p className="text-sm mt-1">ID consultado: {id}</p>
        <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Error desconocido'}</p>
      </div>
    );
  }
}