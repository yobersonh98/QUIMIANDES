import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, FileText, MapPin, Phone } from "lucide-react"

export interface ProveedorEntity {
  id: string
  documento: string
  tipoDocumento: string
  nombre: string
  direccion: string
  telefono?: string
  facturaIva: boolean
}

interface VisualizarProveedorProps {
  proveedor: ProveedorEntity
}

export function VisualizarProveedor({ proveedor }: VisualizarProveedorProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold">{proveedor.nombre}</CardTitle>
          <Badge variant={proveedor.facturaIva ? "default" : "secondary"}>
            {proveedor.facturaIva ? "Factura IVA" : "No Factura IVA"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4 text-sm">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">{proveedor.tipoDocumento}</p>
            <p className="text-muted-foreground">{proveedor.documento}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">ID del Proveedor</p>
            <p className="text-muted-foreground">{proveedor.id}</p>
          </div>
        </div>

        {proveedor.direccion && (
          <div className="flex items-center space-x-4 text-sm">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Dirección</p>
              <p className="text-muted-foreground">{proveedor.direccion}</p>
            </div>
          </div>
        )}

        {proveedor.telefono && (
          <div className="flex items-center space-x-4 text-sm">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Teléfono</p>
              <p className="text-muted-foreground">{proveedor.telefono}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

