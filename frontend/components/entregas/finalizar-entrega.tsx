"use client"

import { useState } from "react"
import { Check, MapPin, Package, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

// Import the entity types
import { EntregaEntity, EstadoEntrega } from "@/services/entrega-pedido/entities/entrega.entity"
import { EntregaProdcutoEntity } from "@/services/entrega-pedido/entities/entrega-producto.entity"
import EntregaResumen from "./entrega-resumen"

interface FinalizarEntregaProps {
  entrega: EntregaEntity
  onSave?: (updatedEntrega: EntregaEntity) => void
}

export default function FinalizarEntrega({ entrega: initialEntrega, onSave }: FinalizarEntregaProps) {
  const { toast } = useToast()
  const [entrega, setEntrega] = useState<EntregaEntity>(initialEntrega)
  const [deliveredQuantities, setDeliveredQuantities] = useState<Record<string, number>>(
    entrega.entregaProductos?.reduce(
      (acc, producto) => {
        acc[producto.id] = producto.cantidadDespachada // Default to dispatched quantity
        return acc
      },
      {} as Record<string, number>,
    ) || {},
  )
  const [productObservations, setProductObservations] = useState<Record<string, string>>(
    entrega.entregaProductos?.reduce(
      (acc, producto) => {
        acc[producto.id] = producto.observaciones || ""
        return acc
      },
      {} as Record<string, string>,
    ) || {},
  )

  const handleDeliveredQuantityChange = (id: string, value: number) => {
    setDeliveredQuantities((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleObservationChange = (id: string, value: string) => {
    setProductObservations((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleFinalizeDelivery = () => {
    // Check if all products have been fully delivered
    const allFullyDelivered = entrega.entregaProductos?.every(
      (producto) => deliveredQuantities[producto.id] === producto.cantidadDespachar,
    )

    // Update the entrega object with the new delivered quantities
    const updatedEntregaProductos = entrega.entregaProductos?.map((producto) => ({
      ...producto,
      cantidadEntregada: deliveredQuantities[producto.id],
      observaciones: productObservations[producto.id],
    }))

    const updatedEntrega = {
      ...entrega,
      estado: allFullyDelivered ? "ENTREGADO" : "EN_TRANSITO" as EstadoEntrega, // Using EN_TRANSITO since PARCIAL is not in the new type
      entregaProductos: updatedEntregaProductos,
    }

    setEntrega(updatedEntrega)

    // Call the onSave callback if provided
    if (onSave) {
      onSave(updatedEntrega)
    }

    toast({
      title: "Entrega finalizada",
      description: `La entrega ha sido marcada como ${allFullyDelivered ? "ENTREGADO" : "EN_TRANSITO"}.`,
    })
  }

  // Calculate delivery progress
  const calculateProgress = (producto: EntregaProdcutoEntity) => {
    if (producto.cantidadDespachar === 0) return 0
    return (deliveredQuantities[producto.id] / producto.cantidadDespachar) * 100
  }


  return (
    <div className="container mx-auto py-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Delivery Information */}
        <EntregaResumen entrega={entrega} />

        {/* Right side - Products to finalize */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Entregados</CardTitle>
            <CardDescription>Registre las cantidades entregadas al cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {entrega.entregaProductos?.map((producto) => (
                <div key={producto.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{producto.detallePedido?.producto.nombre}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {producto.detallePedido?.lugarEntrega.nombre},{" "}
                          {producto.detallePedido?.lugarEntrega.ciudad.nombre}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Tipo de entrega: <Badge variant="outline">{producto.detallePedido?.tipoEntrega}</Badge>
                        </span>
                      </div>
                    </div>
                    <div>
                      <Badge variant="secondary">{producto.cantidadDespachada} unidades despachadas</Badge>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`cantidad-${producto.id}`}>Cantidad Entregada</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id={`cantidad-${producto.id}`}
                        type="number"
                        value={deliveredQuantities[producto.id]}
                        onChange={(e) =>
                          handleDeliveredQuantityChange(producto.id, Number.parseInt(e.target.value) || 0)
                        }
                        min={0}
                        max={producto.cantidadDespachada}
                      />
                      <span className="text-sm text-muted-foreground">/ {producto.cantidadDespachada}</span>
                    </div>
                    <div className="mt-2">
                      <Progress value={calculateProgress(producto)} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0</span>
                        <span>{producto.cantidadDespachar}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`observaciones-${producto.id}`}>Observaciones de Entrega</Label>
                    <Textarea
                      id={`observaciones-${producto.id}`}
                      value={productObservations[producto.id]}
                      onChange={(e) => handleObservationChange(producto.id, e.target.value)}
                      placeholder="Ingrese observaciones sobre la entrega de este producto"
                      className="mt-1"
                    />
                  </div>

                  {calculateProgress(producto) === 100 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Entrega completa</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleFinalizeDelivery}>
              <Check className="mr-2 h-4 w-4" />
              Finalizar Entrega
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}