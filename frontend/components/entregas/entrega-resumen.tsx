// components/EntregaResumen.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileText, MapPin, Truck, User } from "lucide-react"
import { EntregaEntity } from "@/services/entrega-pedido/entities/entrega.entity"
import { formatearFecha } from "@/lib/utils"

interface EntregaResumenProps {
  entrega: EntregaEntity
}

export default function EntregaResumen({ entrega }: EntregaResumenProps) {


  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Entrega</CardTitle>
        <CardDescription>Detalles básicos de la entrega #{entrega.id}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Pedido:</span> {entrega.pedidoId}
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Cliente:</span> {entrega.pedido?.cliente.nombre}
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <span className="font-medium">Dirección:</span>
              <p className="text-sm text-muted-foreground">
                Documento: {entrega.pedido?.cliente.documento || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Vehículo Interno:</span> {entrega.vehiculoInterno || "N/A"}
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Vehículo Externo:</span> {entrega.vehiculoExterno || "N/A"}
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Entregado por:</span> {entrega.entregadoPorA}
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Remisión:</span> {entrega.remision || "N/A"}
          </div>
        </div>

        <Separator />

        <div>
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea id="observaciones" value={entrega.observaciones || ""} readOnly className="mt-2" />
        </div>

        <div>
          <Label>Estado Actual</Label>
          <div className="mt-2">
            <Badge variant={entrega.estado === "PENDIENTE" ? "default" : "outline"}>{entrega.estado}</Badge>
          </div>
        </div>

        <div>
          <Label>Fecha de Recepción del Pedido</Label>
          <div className="text-sm mt-1">
            {formatearFecha(entrega.pedido?.fechaRecibido)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
