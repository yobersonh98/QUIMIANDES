import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarIcon, File, LocateIcon, MapPin, Truck, User } from "lucide-react";
import moment from "moment";
import EstadoBadge from "../shared/estado-badge";
import CardEntregaProductos from "./card-entrega-productos";

interface CardEntregaInfoProps {
  codigo: string;
  estado: string;
  clienteNombre: string;
  fechaEntrega?: string | null;
  observaciones?: string | null;
  remision?: string | null;
  vehiculo?: string | null;
  pedido?: {
    codigo?: string
    cliente: {
      direccion: string
    }
  }
  lugaresEntrega: {
    id?: string;
    nombre?: string;
    direccion?: string;
    ciudad?: string;
  }[];
  productos?: {
    id?: string;
    nombre?: string;
    cantidadDespachar?: number;
  }[];
  mostrarProductos?: boolean;
  showTitle?: boolean;
}

export default function CardEntregaInfo({
  codigo,
  estado,
  clienteNombre,
  fechaEntrega,
  observaciones,
  remision,
  vehiculo,
  lugaresEntrega,
  productos = [],
  mostrarProductos = false,
  showTitle = true,
  pedido,
}: CardEntregaInfoProps) {
  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="pb-2">
          {showTitle && (
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Entrega {codigo}
            </CardTitle>
          )}
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Pedido:</span>
            <span>{pedido?.codigo}</span>
          </div>
          <div className="flex justify-between flex-wrap">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Cliente:</span>
              <span>{clienteNombre}</span>
            </div>
            <div className="flex items-center gap-2">
              <LocateIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Dirección:</span>
              <span>{pedido?.cliente.direccion || '-'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Fecha de Entrega:</span>
            <span>{fechaEntrega ? moment(fechaEntrega).format("DD/MM/YYYY") : "No programada"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Estado Entrega:</span>
            <EstadoBadge estado={estado} />
          </div>

          {observaciones && (
            <div className="text-muted-foreground">
              <span className="font-medium">Obs:</span> {observaciones}
            </div>
          )}

          {remision && (
            <div>
              <span className="font-medium">Remisión:</span> {remision}
            </div>
          )}

          <div>
            <span className="font-medium">Vehículo:</span> {vehiculo || "No asignado"}
          </div>
        </CardContent>
      </Card>

      {/* Lugares */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Lugares</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {lugaresEntrega.length > 0 ? (
            lugaresEntrega.map((lugar) => (
              <div key={lugar.id} className="border rounded p-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{lugar.nombre}</span>
                </div>
                {lugar.direccion && (
                  <div className="text-muted-foreground">
                    {lugar.direccion}, {lugar.ciudad}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">Sin lugares registrados</p>
          )}
        </CardContent>
      </Card>

      {mostrarProductos && productos.length > 0 && (
        <CardEntregaProductos productos={productos} />
      )}
    </div>
  );
}
