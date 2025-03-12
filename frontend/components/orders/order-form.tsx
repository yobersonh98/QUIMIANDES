"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import SelectWithSearch from "../shared/SelectWithSearch"
import { CustomFormInput } from "../shared/custom-form-input"
import { CustomFormDatePicker } from "../shared/custom-form-date-picker"
import { CustomSelect } from "../shared/custom-select"
import { useSession } from "next-auth/react"
import { CrearPedidoModel } from "@/services/pedidos/models/crear-pedido.model"
import { PedidoService } from "@/services/pedidos/pedido.service"

const orderFormSchema = z.object({
  idCliente: z.string({
    required_error: "Por favor seleccione un cliente",
  }),
  fechaPedido: z.date({
    required_error: "Por favor seleccione la fecha del pedido",
  }),
  fechaRequerimiento: z.date({
    required_error: "Por favor seleccione una fecha de requerimiento",
  }),
  estado: z.string({
    required_error: "Por favor seleccione un estado",
  }),
  ordenCompra: z.string().optional(),
  observaciones: z.string().optional(),
  productos: z
    .array(
      z.object({
        productoId: z.string({
          required_error: "Por favor seleccione un producto",
        }),
        cantidad: z.number({
          required_error: "Por favor ingrese la cantidad",
        }),
        fechaRequerimiento: z.date({
          required_error: "Por favor seleccione una fecha de requerimiento",
        }),
        tipoEntrega: z.string({
          required_error: "Por favor seleccione el tipo de entrega",
        }),
        ciudad: z.string({
          required_error: "Por favor ingrese la ciudad",
        }),
      }),
    )
    .min(1, "Debe agregar al menos un producto"),
})

type OrderFormValues = z.infer<typeof orderFormSchema>


const tiposEntrega = [
  { id: "entrega_cliente", nombre: "Entrega al Cliente" },
  { id: "recoge_planta", nombre: "Recoge en Planta" },
]

export function OrderForm() {
  const session = useSession();
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      productos: [{}],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "productos",
    control: form.control,
  })

async  function onSubmit(data: OrderFormValues) {
    // const datos:CrearPedidoModel = {
    //   ...data,
    //   detallesPedido:data.productos,
    // }
    // const response = await new PedidoService(session.data?.user.token).crear(datos);
    
    // Aquí iría la lógica para guardar el pedido
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="idCliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <SelectWithSearch
                      endpoint="cliente/search"
                      onSelect={field.onChange}
                      defaultValue={field.value}
                      placeholder="Seleccione un cliente"
                      maperOptions={(cliente) => ({ value: cliente.id, label: cliente.nombre })}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomFormDatePicker 
                control={form.control}
                name="fechaPedido"
                label="Fecha del Pedido"
                defaultValue={new Date()}
                withTime
              />
              <CustomFormInput 
                control={form.control}
                name="ordenCompra"
                label="Orden de Compra"
                placeholder="Ingrese el número de orden de compra"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Productos</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => append({
                cantidad: 1,
                fechaRequerimiento: new Date(),
                tipoEntrega: "",
                lugarEntrega: "",
                productoId: "",
                ciudad: "",
              })}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`productos.${index}.productoId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Producto</FormLabel>
                            <SelectWithSearch
                              endpoint="productos/search"
                              onSelect={field.onChange}
                              defaultValue={field.value}
                              placeholder="Seleccione un producto"
                              maperOptions={(producto) => ({ value: producto.id, label: producto.nombre })}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <CustomFormInput 
                        control={form.control}
                        name={`productos.${index}.cantidad`}
                        label="Cantidad"
                        type="number"
                      />

                      <CustomFormDatePicker
                        control={form.control}
                        name={`productos.${index}.fechaRequerimiento`}
                        label="Fecha de Requerimiento"
                        defaultValue={new Date()}
                      />

                      <FormField
                        control={form.control}
                        name={`productos.${index}.tipoEntrega`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Entrega</FormLabel>
                            <CustomSelect 
                              options={tiposEntrega.map((tipo) => ({ value: tipo.id, label: tipo.nombre }))}
                              onChange={field.onChange}
                              placeholder="Seleccione tipo de entrega"
                              defaultValue={field.value}
                          />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`productos.${index}.lugarEntrega`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lugar de Entrega</FormLabel>
                            <FormControl>
                              <SelectWithSearch 
                                endpoint="lugar-entrega/search"
                                onSelect={field.onChange}
                                defaultValue={field.value}
                                params={{
                                  idCliente: form.getValues('idCliente'),
                                }}
                                placeholder="Seleccione una ciudad"
                                maperOptions={(ciudad) => ({ value: ciudad.id, label: ciudad.nombre })}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="button" variant="ghost" size="sm" className="mt-4" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar Producto
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ingrese observaciones adicionales..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="submit" size="lg">
            Crear Pedido
          </Button>
        </div>
      </form>
    </Form>
  )
}

