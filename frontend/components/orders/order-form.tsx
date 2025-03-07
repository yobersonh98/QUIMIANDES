"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import SelectWithSearch from "../shared/SelectWithSearch"
import { CustomFormInput } from "../shared/custom-form-input"
import { CustomFormDatePicker } from "../shared/custom-form-date-picker"

const orderFormSchema = z.object({
  clienteId: z.string({
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
        presentacion: z.string({
          required_error: "Por favor seleccione una presentación",
        }),
        unidad: z.number({
          required_error: "Por favor ingrese la unidad",
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
        lugarEntrega: z.string({
          required_error: "Por favor ingrese el lugar de entrega",
        }),
        ciudad: z.string({
          required_error: "Por favor ingrese la ciudad",
        }),
      }),
    )
    .min(1, "Debe agregar al menos un producto"),
})

type OrderFormValues = z.infer<typeof orderFormSchema>


const productos = [
  { id: "1", nombre: "PHCA-20" },
  { id: "2", nombre: "PAC-19" },
  { id: "3", nombre: "Cloro Gaseoso" },
  { id: "4", nombre: "Soda Caustica" },
  { id: "5", nombre: "Acido Clorhidrico" },
]

const presentaciones = [
  { id: "granel", nombre: "Granel" },
  { id: "caneca250", nombre: "Caneca 250kg" },
  { id: "contenedor", nombre: "Contenedor" },
  { id: "saco25", nombre: "Saco 25kg" },
]

const tiposEntrega = [
  { id: "entrega_cliente", nombre: "Entrega al Cliente" },
  { id: "recoge_planta", nombre: "Recoge en Planta" },
]

export function OrderForm() {
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

  function onSubmit(data: OrderFormValues) {
    console.log(data)
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
                name="clienteId"
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
{/* 
              <FormField
                control={form.control}
                name="fechaPedido"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha del Pedido</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccione una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} locale={es} />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <CustomFormDatePicker 
                control={form.control}
                name="fechaPedido"
                label="Fecha del Pedido"
                defaultValue={new Date()}
                withTime
              />

              <FormField
                control={form.control}
                name="fechaRequerimiento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Requerimiento General</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccione una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} locale={es} />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
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
              <Button type="button" variant="outline" size="sm" onClick={() => append({})}>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione un producto" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {productos.map((producto) => (
                                  <SelectItem key={producto.id} value={producto.id}>
                                    {producto.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`productos.${index}.presentacion`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Presentación</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione presentación" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {presentaciones.map((pres) => (
                                  <SelectItem key={pres.id} value={pres.id}>
                                    {pres.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`productos.${index}.unidad`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unidad</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`productos.${index}.cantidad`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cantidad</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`productos.${index}.fechaRequerimiento`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Fecha de Requerimiento</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: es })
                                    ) : (
                                      <span>Seleccione una fecha</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} locale={es} />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`productos.${index}.tipoEntrega`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Entrega</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione tipo de entrega" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {tiposEntrega.map((tipo) => (
                                  <SelectItem key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                              <Input {...field} placeholder="Ej: Planta Principal" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`productos.${index}.ciudad`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ciudad</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ej: Cúcuta" />
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

