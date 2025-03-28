"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { PedidoEntity } from "@/services/pedidos/entity/pedido.entity"
import { CustomFormDatePicker } from "../shared/custom-form-date-picker"
import { DetallePedidoEntity } from "@/services/detalle-pedido/entity/detalle-pedido.entity"

const formSchema = z.object({
  lugarEntregaId: z.string({
    required_error: "Selecciona un lugar de entrega",
  }),
  fechaEntrega: z.date({
    required_error: "Selecciona una fecha de entrega",
  }),
  vehiculoInterno: z.string().optional(),
  vehiculoExterno: z.string().optional(),
  entregadoPorA: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres",
  }),
  remision: z.string().optional(),
  observaciones: z.string().optional(),
  productos: z.array(
    z.object({
      detallePedidoId: z.string(),
      cantidadDespachada: z.coerce.number().min(0),
      incluir: z.boolean().default(true),
    }),
  ),
})

export function CrearEntregaForm({ pedido }: { pedido: PedidoEntity }) {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehiculoInterno: "",
      vehiculoExterno: "",
      entregadoPorA: "",
      remision: "",
      observaciones: "",
      productos: [],
    },
  })

  useEffect(() => {
    // Inicializar los productos en el formulario
    form.setValue(
      "productos",
      pedido.detallesPedido.map((detalle: DetallePedidoEntity) => ({
        detallePedidoId: detalle.id,
        cantidadDespachada: detalle.cantidad - detalle.cantidadDespachada,
        incluir: true,
      }))
    )

    // Establecer el lugar de entrega del primer detalle de pedido (si existe)
    if (pedido.detallesPedido.length > 0) {
      form.setValue("lugarEntregaId", pedido.detallesPedido[0].lugarEntregaId || "")
    }
  }, [pedido, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    // En producción, aquí enviarías los datos a tu API
    console.log(values)
    alert("Entrega programada con éxito")
    // Redirigir a la lista de entregas
    window.location.href = "/entregas"
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de Entrega</CardTitle>
              <CardDescription>Datos generales para la programación de la entrega</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CustomFormDatePicker
                control={form.control}
                name="fechaEntrega"
                label="Fecha de Entrega"
                defaultValue={new Date()}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vehiculoInterno"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehículo Interno</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC-123" {...field} />
                      </FormControl>
                      <FormDescription>Placa del vehículo interno</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehiculoExterno"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehículo Externo</FormLabel>
                      <FormControl>
                        <Input placeholder="XYZ-789" {...field} />
                      </FormControl>
                      <FormDescription>Placa del vehículo externo</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="entregadoPorA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsable de Entrega</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del responsable" {...field} />
                    </FormControl>
                    <FormDescription>Persona encargada de realizar la entrega</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Remisión</FormLabel>
                    <FormControl>
                      <Input placeholder="REM-2023-001" {...field} />
                    </FormControl>
                    <FormDescription>Número de documento de remisión (opcional)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Instrucciones especiales para la entrega"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Información adicional para la entrega</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Productos a Despachar</CardTitle>
              <CardDescription>Selecciona los productos y cantidades a incluir en esta entrega</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pedido.detallesPedido.map((detalle: DetallePedidoEntity, index: number) => (
                  <div key={detalle.id} className="flex flex-col space-y-2 p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="font-medium">{detalle.producto.nombre}</div>
                      <FormField
                        control={form.control}
                        name={`productos.${index}.incluir`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Incluir</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Cantidad total: {detalle.cantidad} unidades
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Pendiente por despachar: {detalle.cantidad - detalle.cantidadDespachada} unidades
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tipo de entrega: {detalle.tipoEntrega}
                    </div>

                    <FormField
                      control={form.control}
                      name={`productos.${index}.cantidadDespachada`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cantidad a Despachar</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              min={0}
                              max={detalle.cantidad - detalle.cantidadDespachada}
                              disabled={!form.watch(`productos.${index}.incluir`)}
                            />
                          </FormControl>
                          <FormDescription>
                            Cantidad a incluir en esta entrega (máximo: {detalle.cantidad - detalle.cantidadDespachada})
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`productos.${index}.detallePedidoId`}
                      render={({ field }) => <input type="hidden" {...field} value={detalle.id} />}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancelar
          </Button>

          <Button type="submit">Registrar</Button>
        </div>
      </form>
    </Form>
  )
}