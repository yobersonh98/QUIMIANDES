"use client"
import { useState, useMemo } from "react"
import { Calendar, momentLocalizer, View } from "react-big-calendar"
import moment from "moment"
import "moment/locale/es"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Truck } from "lucide-react"
import { EntregaListadoItemEntity } from "@/services/entrega-pedido/entities/listado-entrega-item.entity"
import CardEntregaInfo from "./card-entrega-info"
import Link from "next/link"
type HandleSelectEvent = ((event: {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: EntregaListadoItemEntity;
}, e: React.SyntheticEvent<HTMLElement>) => void) | undefined

type CalendarEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource: EntregaListadoItemEntity;
}
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

// Mensajes en español para el calendario
const messages = {
  allDay: "Todo el día",
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "No hay eventos en este rango",
  showMore: (total: number) => `+ Ver más (${total})`,
}

interface CalendarioEntregasProps {
  entregas: EntregaListadoItemEntity[]
}

export default function CalendarioEntregas({ entregas }: CalendarioEntregasProps) {
  const [selectedEntrega, setSelectedEntrega] = useState<EntregaListadoItemEntity | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [view, setView] = useState<View>("month")
  const [date, setDate] = useState(new Date())

  // Convertir las entregas al formato que espera el calendario
  const events: CalendarEvent[] = useMemo(() => {
    return entregas.map((entrega) => ({
      id: entrega.id,
      title: `${entrega.codigo} - ${entrega.pedido.cliente.nombre}`,
      start: entrega.fechaEntrega ? new Date(entrega.fechaEntrega) : new Date(entrega.fechaCreacion),
      end: entrega.fechaEntrega ? new Date(entrega.fechaEntrega) : new Date(entrega.fechaCreacion),
      resource: entrega,
    }))
  }, [entregas])

  // Función para manejar el clic en un evento
  const handleSelectEvent: HandleSelectEvent = (event) => {
    setSelectedEntrega(event.resource)
    setIsModalOpen(true)
  }

  // Personalizar el estilo de los eventos según el estado
  const eventStyleGetter = (event: CalendarEvent) => {
    const estado = event.resource.estado
    const backgroundColor = estado in estadoColors ? estadoColors[estado as keyof typeof estadoColors] : "bg-gray-500"

    return {
      className: `${backgroundColor} text-white rounded-md px-2 py-1`,
      style: {
        borderRadius: "4px",
      },
    }
  }

  // Manejadores de navegación y vistas
  const onNavigate = (newDate: Date) => {
    setDate(newDate)
  }

  const onView = (newView: View) => {
    setView(newView)
  }
  const esPediente = selectedEntrega?.estado === "PENDIENTE"
  const esEnTransito = selectedEntrega?.estado === "EN_TRANSITO"
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
        messages={messages}
        date={date}
        view={view}
        onNavigate={onNavigate}
        onView={onView}
        popup
        culture="es"
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
              <CardEntregaInfo
                showTitle={false}
                codigo={selectedEntrega.codigo}
                estado={selectedEntrega.estado}
                clienteNombre={selectedEntrega.pedido.cliente.nombre}
                fechaEntrega={selectedEntrega.fechaEntrega?.toString()}
                observaciones={selectedEntrega.observaciones}
                remision={selectedEntrega.remision}
                vehiculo={selectedEntrega.vehiculoInterno || selectedEntrega.vehiculoExterno}
                lugaresEntrega={Array.from(
                  new Map(
                    selectedEntrega.entregaProductos
                      .filter((ep) => ep.detallePedido?.lugarEntrega)
                      .map((ep) => {
                        const lugar = ep?.detallePedido?.lugarEntrega
                        return [lugar?.id, {
                          id: lugar?.id,
                          nombre: lugar?.nombre,
                          direccion: lugar?.direccion,
                          ciudad: lugar?.ciudad?.nombre
                        }]
                      })
                  ).values()
                )}
                productos={selectedEntrega.entregaProductos.map((ep) => ({
                  id: ep.id,
                  nombre: ep.detallePedido?.producto.nombre || "Producto sin nombre",
                  cantidadDespachar: ep.cantidadDespachar,
                }))}
                mostrarProductos
              />


              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cerrar
                </Button>

                {esPediente && (
                    <Link href={`/dashboard/pedidos/${selectedEntrega.pedidoId}/gestionar/entregas/${selectedEntrega.id}/despacho`}>
                      <Button>
                        Confirmar Despacho
                      </Button>
                    </Link>
                  )}

                  {esEnTransito && (
                    <Link href={`/dashboard/pedidos/${selectedEntrega.pedidoId}/gestionar/entregas/${selectedEntrega.id}/finalizar-entrega`}>
                      <Button>
                        Finalizar Entrega
                      </Button>
                    </Link>
                  )}

              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}