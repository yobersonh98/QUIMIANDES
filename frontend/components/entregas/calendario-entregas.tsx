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
import { getHexColorByEstado } from "@/lib/utils"

// Configurar moment en español
moment.locale("es")
const localizer = momentLocalizer(moment)

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: EntregaListadoItemEntity;
  allDay?: boolean;
}

type HandleSelectEvent = ((event: CalendarEvent, e: React.SyntheticEvent<HTMLElement>) => void) | undefined

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
  showMore: (total: number) => `+ Ver (${total})`,
}

interface CalendarioEntregasProps {
  entregas: EntregaListadoItemEntity[]
}

export default function CalendarioEntregas({ entregas }: CalendarioEntregasProps) {
  const [selectedEntrega, setSelectedEntrega] = useState<EntregaListadoItemEntity | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [view, setView] = useState<View>("month")
  const [date, setDate] = useState(new Date())

  const events: CalendarEvent[] = useMemo(() => {
    return entregas.map((entrega) => {
      const fecha = entrega.fechaEntrega ? new Date(entrega.fechaEntrega) : new Date(entrega.fechaCreacion)
      const fechaNormalizada = new Date(fecha.setHours(0, 0, 0, 0))

      return {
        id: entrega.id,
        title: `${entrega.codigo} - ${entrega.pedido.cliente.nombre}`,
        start: fechaNormalizada,
        end: fechaNormalizada,
        resource: entrega,
        allDay: true,
      }
    })
  }, [entregas])

  const handleSelectEvent: HandleSelectEvent = (event) => {
    setSelectedEntrega(event.resource)
    setIsModalOpen(true)
  }

  const eventStyleGetter = (event: CalendarEvent) => {
    const estado = event.resource.estado
    const backgroundColor = getHexColorByEstado(estado)
    return {
      style: {
        backgroundColor,
        color: "#fff",
        borderRadius: "4px",
        padding: "2px 6px",
      },
    }
  }

  const onNavigate = (newDate: Date) => {
    setDate(newDate)
  }

  const onView = (newView: View) => {
    setView(newView)
  }

  const onShowMore = (events: CalendarEvent[], date: Date) => {
    setView('agenda')
    setDate(date)
    return false;
  }

  const esPendiente = selectedEntrega?.estado === "PENDIENTE"
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
        views={["month", "agenda"]}
        messages={messages}
        date={date}
        view={view}
        onNavigate={onNavigate}
        onView={onView}
        popup={false}
        onShowMore={onShowMore}
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
                pedido={{
                  codigo: selectedEntrega.pedido.codigo,
                  cliente: selectedEntrega.pedido.cliente
                }}
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

              <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cerrar
                </Button>

                <div>
                  {esPendiente && (
                    <Button className="w-full">
                      <Link href={`/dashboard/pedidos/${selectedEntrega.pedidoId}/gestionar/entregas/${selectedEntrega.id}/despacho`} className="flex-1 w-full">
                        Confirmar Despacho
                      </Link>
                    </Button>
                  )}
                  {esEnTransito && (
                    <Button className="w-full">
                      <Link href={`/dashboard/pedidos/${selectedEntrega.pedidoId}/gestionar/entregas/${selectedEntrega.id}/finalizar-entrega`}>
                        Finalizar Entrega
                      </Link>
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}