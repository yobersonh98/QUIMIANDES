// components/EntregaResumen.tsx

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Truck, User } from "lucide-react"
import { EntregaEntity } from "@/services/entrega-pedido/entities/entrega.entity"
import { formatearFecha } from "@/lib/utils"
import EstadoBadge from "../shared/estado-badge"

interface EntregaResumenProps {
  entrega: EntregaEntity
  modoEdicion?: boolean
  onChange?: (value: EntregaEntity) => void
  disabledFields?: (keyof EntregaEntity)[]
  onGuardar?: () => void
}

export default function EntregaResumen({ 
  entrega, 
  modoEdicion = false,
  onChange,
  onGuardar,
  disabledFields
}: EntregaResumenProps) {
  const onChangeRemision = (value: string) => {
    if (onChange) {
      onChange({ ...entrega, remision: value })
    }
  }
  const onChangeObservacion = (value:string) => {
    if (onChange) onChange({...entrega, observaciones: value})
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Entrega</CardTitle>
        <CardDescription>Detalles básicos de la entrega #{entrega.codigo}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Pedido:</span> {entrega.pedido?.codigo}
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Cliente:</span> {entrega.pedido?.cliente.nombre}
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
            <span className="font-medium">Remisión:</span> 
            {modoEdicion && !disabledFields?.includes('remision')? (
              <Input 
                value={entrega.remision || ""} 
                onChange={(e) => onChangeRemision && onChangeRemision(e.target.value)} 
                className="ml-2 w-full max-w-xs" 
              />
            ) : (
              entrega.remision || "N/A"
            )}
          </div>
        </div>

        <Separator />

        <div>
          <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea 
              id="observaciones" 
              value={entrega.observaciones || ""}
              readOnly={!modoEdicion || disabledFields?.includes('observaciones')}
              onChange={e => onChangeObservacion(e.target.value)} 
              className="mt-2" 
            />
          {/* )} */}
        </div>

        <div>
          <Label>Estado Actual</Label>
          <div className="mt-2">
            <EstadoBadge estado={entrega.estado}/>
          </div>
        </div>

        <div>
          <Label>Fecha de Recepción del Pedido</Label>
          <div className="text-sm mt-1">
            {formatearFecha(entrega.pedido?.fechaRecibido)}
          </div>
        </div>
      </CardContent>

      {onGuardar && (
        <CardFooter className="flex justify-end">
          <Button onClick={() => onGuardar && onGuardar()}>Guardar Cambios</Button>
        </CardFooter>
      )}
    </Card>
  )
}