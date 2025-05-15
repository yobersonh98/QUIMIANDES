import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
interface CardEntregaProductosProps {
  productos: {
    id?: string;
    nombre?: string;
    cantidadDespachar?: number;
  }[];
}
 
export default function CardEntregaProductos({ productos }: CardEntregaProductosProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="h-5 w-5" />
          Productos ({productos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {productos.map((producto) => (
            <div key={producto.id} className="border rounded-md p-3">
              <div className="font-medium">{producto.nombre || "Producto sin nombre"}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Cantidad a despachar: {producto.cantidadDespachar}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
