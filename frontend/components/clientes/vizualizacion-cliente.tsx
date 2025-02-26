import { User, MapPin, Mail, Phone, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DatosClienteProps {
  datosCliente: {
    nombre: string;
    documento: string;
    tipoDocumento: string;
    direccion: string;
    zone: string;
    email?: string;
    telefono?: string;
    idMunicipio: string;
    municipio?: string;
  };
  datosEntrega: {
    nombre: string;
    ciudad?: string;
    direccion: string;
    contacto: string;
  }[];
}

export default function VisualizacionCliente({ datosCliente, datosEntrega }: DatosClienteProps) {
  return (
    <div className="space-y-4">
      {/* Información del Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-6 w-6" />
            <span>Información del Cliente</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nombre</p>
              <p>{datosCliente.nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Documento</p>
              <p>
                {datosCliente.tipoDocumento}: {datosCliente.documento}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dirección</p>
              <p>{datosCliente.direccion}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Zona</p>
              <Badge variant="secondary">{datosCliente.zone}</Badge>
            </div>
            {datosCliente.email && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Correo Electrónico</p>
                <p className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{datosCliente.email}</span>
                </p>
              </div>
            )}
            {datosCliente.telefono && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                <p className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{datosCliente.telefono}</span>
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ciudad</p>
              <p>{datosCliente.municipio}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ubicaciones de Entrega */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-6 w-6" />
            <span>Ubicaciones de Entrega</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {datosEntrega.map((entrega, index) => (
              <div key={index} className="border rounded-lg p-3 shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                <p>{entrega.nombre}</p>
                <p className="text-sm font-medium text-muted-foreground mt-2">Ciudad</p>
                <p>{entrega.ciudad}</p>
                <p className="text-sm font-medium text-muted-foreground mt-2">Dirección</p>
                <p className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{entrega.direccion}</span>
                </p>
                <p className="text-sm font-medium text-muted-foreground mt-2">Contacto</p>
                <p>{entrega.contacto}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
