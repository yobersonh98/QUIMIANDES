"use client"

import { useState, useMemo } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "moment/locale/es"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { MapPin, Package, Truck, User, CalendarIcon } from "lucide-react"
import { EntregaListadoItemEntity } from "@/services/entrega-pedido/entities/listado-entrega-item.entity"

// Configurar el localizador para español
moment.locale("es")
const localizer = momentLocalizer(moment)

// Mapeo de estados a colores
const estadoColors = {
  PENDIENTE: "bg-yellow-500",
  EN_TRANSITO: "bg-blue-500",
  PARCIAL: "bg-orange-500",
  ENTREGADO: "bg-green-500",
  CANCELADO: "bg-red-500",
}

interface CalendarioEntregasProps {
  entregas: EntregaListadoItemEntity[]
}

export default function CalendarioEntregas({ entregas }: CalendarioEntregasProps) {
  const [selectedEntrega, setSelectedEntrega] = useState<EntregaListadoItemEntity | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  // Convertir las entregas al formato que espera el calendario
  const events = useMemo(() => {
    return entregas.map((entrega) => ({
      id: entrega.id,
      title: `${entrega.codigo} - ${entrega.pedido.cliente.nombre}`,
      start: entrega.fechaEntrega ? new Date(entrega.fechaEntrega) : new Date(entrega.fechaCreacion),
      end: entrega.fechaEntrega ? new Date(entrega.fechaEntrega) : new Date(entrega.fechaCreacion),
      resource: entrega,
    }))
  }, [entregas])

  // Función para manejar el clic en un evento
  const handleSelectEvent = (event: any) => {
    setSelectedEntrega(event.resource)
    setIsModalOpen(true)
  }

  // Función para gestionar la entrega
  const handleGestionarEntrega = () => {
    if (selectedEntrega) {
      router.push(`/entregas/gestionar/${selectedEntrega.id}`)
    }
  }

  // Personalizar el estilo de los eventos según el estado
  const eventStyleGetter = (event: any) => {
    const estado = event.resource.estado
    const backgroundColor = estado in estadoColors ? estadoColors[estado as keyof typeof estadoColors] : "bg-gray-500"

    return {
      className: `${backgroundColor} text-white rounded-md px-2 py-1`,
      style: {
        borderRadius: "4px",
      },
    }
  }

  return (
    <div className="h-[700px] flex flex-col">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        views={["month", "week", "day", "agenda"]}
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
        }}
      />

      {/* Modal de detalles de entrega */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedEntrega && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Entrega {selectedEntrega.codigo}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Información general */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Cliente:</span>
                      <span>{selectedEntrega.pedido.cliente.nombre}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Fecha de entrega:</span>
                      <span>
                        {selectedEntrega.fechaEntrega
                          ? moment(selectedEntrega.fechaEntrega).format("DD/MM/YYYY")
                          : "No programada"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-medium">Estado:</span>
                      <Badge className={estadoColors[selectedEntrega.estado as keyof typeof estadoColors]}>
                        {selectedEntrega.estado}
                      </Badge>
                    </div>

                    {selectedEntrega.observaciones && (
                      <div>
                        <span className="font-medium">Observaciones:</span>
                        <p className="text-sm text-muted-foreground mt-1">{selectedEntrega.observaciones}</p>
                      </div>
                    )}

                    {selectedEntrega.remision && (
                      <div>
                        <span className="font-medium">Remisión:</span> {selectedEntrega.remision}
                      </div>
                    )}

                    <div>
                      <span className="font-medium">Vehículo:</span>{" "}
                      {selectedEntrega.vehiculoInterno || selectedEntrega.vehiculoExterno || "No asignado"}
                    </div>
                  </CardContent>
                </Card>

                {/* Lugares de entrega */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lugares de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedEntrega.entregaProductos.length > 0 ? (
                      <div className="space-y-4">
                        {Array.from(
                          new Set(
                            selectedEntrega.entregaProductos
                              .filter((ep) => ep.detallePedido?.lugarEntrega)
                              .map((ep) => ep.detallePedido?.lugarEntrega.id),
                          ),
                        ).map((lugarId) => {
                          const lugar = selectedEntrega.entregaProductos.find(
                            (ep) => ep.detallePedido?.lugarEntrega.id === lugarId,
                          )?.detallePedido?.lugarEntrega

                          return lugar ? (
                            <div key={lugarId} className="border rounded-md p-3">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{lugar.nombre}</span>
                              </div>
                              {lugar.direccion && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  {lugar.direccion}, {lugar.ciudad.nombre}
                                </div>
                              )}
                            </div>
                          ) : null
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No hay lugares de entrega registrados</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Productos */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Productos ({selectedEntrega.cantidadProductos})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedEntrega.entregaProductos.length > 0 ? (
                    <div className="space-y-4">
                      {selectedEntrega.entregaProductos.map((producto, index) => (
                        <div key={producto.id} className="border rounded-md p-3">
                          <div className="font-medium">
                            {producto.detallePedido?.producto.nombre || "Producto sin nombre"}
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Cantidad a despachar:</span>{" "}
                              {producto.cantidadDespachar}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Cantidad despachada:</span>{" "}
                              {producto.cantidadDespachada}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Cantidad entregada:</span>{" "}
                              {producto.cantidadEntregada}
                            </div>
                            {producto.observaciones && (
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Observaciones:</span> {producto.observaciones}
                              </div>
                            )}
                          </div>
                          {index < selectedEntrega.entregaProductos.length - 1 && <Separator className="mt-3" />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay productos registrados</p>
                  )}
                </CardContent>
              </Card>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cerrar
                </Button>
                <Button onClick={handleGestionarEntrega}>Gestionar Entrega</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
