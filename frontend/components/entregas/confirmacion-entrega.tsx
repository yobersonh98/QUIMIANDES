"use client"

import { useState } from "react"
import { Check, Info, MapPin, Package } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Import the entity types
import { EntregaEntity, EstadoEntrega } from "@/services/entrega-pedido/entities/entrega.entity"
import EntregaResumen from "./entrega-resumen"
import { ConfirmarEntregaModel } from "@/services/entrega-pedido/models/confirmar-despacho..model"
import { ConfirmButton } from "../shared/confirm-botton"
import { useSession } from "next-auth/react"
import { EntregaPedidoService } from "@/services/entrega-pedido/entrega-pedido.service"
import RefreshPage from "@/actions/refresh-page"
import { obtenerLugarEntregaDetallePedido } from "@/services/detalle-pedido/utils/detalle-pedido.util"
interface ConfirmacionEntregaProps {
  entrega: EntregaEntity
  onSave?: (updatedEntrega: EntregaEntity) => void
}

export default function ConfirmacionEntrega({ entrega: initialEntrega }: ConfirmacionEntregaProps) {
  const [entrega, setEntrega] = useState<EntregaEntity>(initialEntrega)
  const { toast } = useToast()
  const token = useSession().data?.user?.token
  const [dispatchQuantities, setDispatchQuantities] = useState<Record<string, number>>(
    entrega.entregaProductos?.reduce(
      (acc, producto) => {
        acc[producto.id] = producto.cantidadDespachar
        return acc
      },
      {} as Record<string, number>,
    ) || {},
  )

  const handleDispatchQuantityChange = (id: string, value: number) => {
    setDispatchQuantities((prev) => ({
      ...prev,
      [id]: value,
    }))
  }
  const entregaProductos = entrega.entregaProductos?.filter(i=> i.detallePedido?.estado !== 'ENTREGADO')

  const handleConfirmDispatch = async () => {
    // Update the entrega object with the new dispatch quantities
    const updatedEntregaProductos = entregaProductos?.map((producto) => ({
      ...producto,
      cantidadDespachada: dispatchQuantities[producto.id],
    }))

    const updatedEntrega = {
      ...entrega,
      estado: "EN_TRANSITO" as EstadoEntrega,
      entregaProductos: updatedEntregaProductos,
    }

    const dataConfirmacionEntrega: ConfirmarEntregaModel = {
      entregaId: updatedEntrega.id,
      remision: updatedEntrega.remision,
      despachosEntregaProducto: updatedEntrega.entregaProductos?.map((producto) => ({
        entregaProductoId: producto.id,
        cantidadDespachada: producto.cantidadDespachada,
        observaciones: producto.observaciones,
      })) || []
    }
    const {error} = await new EntregaPedidoService(token).confirmarEntrega(dataConfirmacionEntrega)
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      return
    }
    setEntrega(updatedEntrega)
    // Call the onSave callback if provided
    RefreshPage(`/dashboard/pedidos/${entrega.pedidoId}/gestionar`)
    toast({
      title: "Despacho confirmado",
      description: "Las cantidades despachadas han sido actualizadas correctamente.",
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <EntregaResumen 
          entrega={entrega}
          modoEdicion={true}
          onChange={(updatedEntrega) => setEntrega(updatedEntrega)}
      />

        <Card>
          <CardHeader>
            <CardTitle>Productos a Despachar</CardTitle>
            <CardDescription>Confirme las cantidades a despachar para cada producto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {entregaProductos?.map((producto) => (
                <div key={producto.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{producto.detallePedido?.producto.nombre}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {obtenerLugarEntregaDetallePedido(producto?.detallePedido)}
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
                      <Badge variant="secondary">{producto.cantidadDespachar} unidades solicitadas</Badge>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`cantidad-${producto.id}`}>Cantidad a Despachar</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id={`cantidad-${producto.id}`}
                        type="number"
                        value={dispatchQuantities[producto.id]}
                        onChange={(e) =>
                          handleDispatchQuantityChange(producto.id, Number.parseInt(e.target.value) || 0)
                        }
                        min={0}
                        max={producto.cantidadDespachar}
                      />
                      <span className="text-sm text-muted-foreground">/ {producto.cantidadDespachar}</span>
                    </div>
                  </div>

                  {producto.observaciones && (
                    <div className="flex items-start gap-2 mt-2">
                      <Info className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Observaciones:</span> {producto.observaciones}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <ConfirmButton 
            title="Confirmar Despacho"
            description="Confirma el despacho de los productos seleccionados"
            onClick={handleConfirmDispatch}
            disabled={entrega.estado !== "PENDIENTE"}
            >
              <Check className="mr-2 h-4 w-4" />
              Confirmar Despacho
            </ConfirmButton>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}