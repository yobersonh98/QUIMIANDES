"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, CheckCircle2, Clock, Truck } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

type Product = {
  id: string
  name: string
  requirementDate: string
  presentation: string
  unit: number
  quantity: number
  dispatchedQuantity: number
  total: number
  receivedWeight: number
  deliveryType: string
  deliveryLocation: string
  city: string
  deliveryStatus: string
  deliveryDate: string
  deliveryNotes: string
}

type ProductDeliveryFormProps = {
  product: Product
  onUpdate: (updatedProduct: Partial<Product>) => void
}

export function ProductDeliveryForm({ product, onUpdate }: ProductDeliveryFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localProduct, setLocalProduct] = useState<Product>(product)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    localProduct.deliveryDate ? new Date(localProduct.deliveryDate) : undefined,
  )

  const handleStatusChange = (status: string) => {
    setLocalProduct({ ...localProduct, deliveryStatus: status })
  }

  const handleDispatchedQuantityChange = (value: string) => {
    const dispatchedQuantity = Number.parseFloat(value)
    setLocalProduct({ ...localProduct, dispatchedQuantity })
  }

  const handleReceivedWeightChange = (value: string) => {
    const receivedWeight = Number.parseFloat(value)
    setLocalProduct({ ...localProduct, receivedWeight })
  }

  const handleDeliveryDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setLocalProduct({
        ...localProduct,
        deliveryDate: format(date, "dd-MMM", { locale: es }),
      })
    }
  }

  const handleNotesChange = (value: string) => {
    setLocalProduct({ ...localProduct, deliveryNotes: value })
  }

  const saveChanges = () => {
    onUpdate(localProduct)
    setIsEditing(false)
  }

  const cancelChanges = () => {
    setLocalProduct(product)
    setSelectedDate(product.deliveryDate ? new Date(product.deliveryDate) : undefined)
    setIsEditing(false)
  }

  const getStatusIcon = () => {
    switch (localProduct.deliveryStatus) {
      case "Entregado":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "Entregado Parcialmente":
        return <Truck className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusBadge = () => {
    let variant: "default" | "secondary" | "outline" = "outline"

    switch (localProduct.deliveryStatus) {
      case "Entregado":
        variant = "default"
        break
      case "Entregado Parcialmente":
        variant = "secondary"
        break
    }

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {getStatusIcon()}
        {localProduct.deliveryStatus}
      </Badge>
    )
  }

  return (
    <Card
      className={cn(
        "border-l-4",
        localProduct.deliveryStatus === "Entregado"
          ? "border-l-green-500"
          : localProduct.deliveryStatus === "Entregado Parcialmente"
            ? "border-l-yellow-500"
            : "border-l-blue-500",
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            {product.name}
            <span className="text-sm font-normal text-muted-foreground">({product.id})</span>
          </CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Gestionar Entrega
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={cancelChanges}>
                Cancelar
              </Button>
              <Button size="sm" onClick={saveChanges}>
                Guardar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Presentación</div>
              <div>{product.presentation}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Cantidad Solicitada</div>
              <div>{product.quantity.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Fecha Requerimiento</div>
              <div>{product.requirementDate}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Estado</div>
              <div>{getStatusBadge()}</div>
            </div>
          </div>

          {isEditing ? (
            <div className="grid gap-4 mt-4 p-4 bg-muted/50 rounded-md">
              <h4 className="font-medium">Gestión de Entrega</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryStatus">Estado de Entrega</Label>
                  <Select value={localProduct.deliveryStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger id="deliveryStatus">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Entregado Parcialmente">Entregado Parcialmente</SelectItem>
                      <SelectItem value="Entregado">Entregado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dispatchedQuantity">Cantidad Despachada</Label>
                  <Input
                    id="dispatchedQuantity"
                    type="number"
                    value={localProduct.dispatchedQuantity}
                    onChange={(e) => handleDispatchedQuantityChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receivedWeight">Peso Recibido</Label>
                  <Input
                    id="receivedWeight"
                    type="number"
                    value={localProduct.receivedWeight}
                    onChange={(e) => handleReceivedWeightChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fecha de Entrega</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={selectedDate} onSelect={handleDeliveryDateChange} locale={es} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="deliveryNotes">Notas de Entrega</Label>
                  <Textarea
                    id="deliveryNotes"
                    value={localProduct.deliveryNotes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    placeholder="Observaciones sobre la entrega..."
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Cantidad Despachada</div>
                <div>{localProduct.dispatchedQuantity.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Peso Recibido</div>
                <div>{localProduct.receivedWeight.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Fecha de Entrega</div>
                <div>{localProduct.deliveryDate || "No registrada"}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Lugar de Entrega</div>
                <div>
                  {product.deliveryLocation}, {product.city}
                </div>
              </div>
              {localProduct.deliveryNotes && (
                <div className="col-span-4">
                  <div className="text-sm font-medium text-muted-foreground">Notas de Entrega</div>
                  <div className="text-sm">{localProduct.deliveryNotes}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

