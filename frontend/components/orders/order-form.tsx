"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
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
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { TipoEntregaProducto, TiposEntrega } from "@/core/constantes/pedido"
import { OrderFormSchema, OrderFormValues } from "./schemas/order-form-schema"

export function OrderForm() {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      detallesPedido: [{}],
    },
  })
  const { toast } = useToast()

  const { fields, append, remove } = useFieldArray({
    name: "detallesPedido",
    control: form.control,
  })

  const detallesPedido = useWatch({
    control: form.control,
    name: `detallesPedido`,
  });

  const idCliente = useWatch({
    control: form.control,
    name: 'idCliente'
  })

  const aplicarValoresGlobales = () => {
    const valoresGlobales = form.getValues();
    detallesPedido.forEach((_, index) => {
      form.setValue(`detallesPedido.${index}.fechaEntrega`, valoresGlobales.fechaEntregaGlobal || new Date());
      form.setValue(`detallesPedido.${index}.tipoEntrega`, valoresGlobales.tipoEntregaGlobal || '');
      form.setValue(`detallesPedido.${index}.lugarEntregaId`, valoresGlobales.lugarEntregaGlobal);
    });
    console.log(form.getValues())
  }

  async function onSubmit() {
    try {
      const data: OrderFormValues = form.getValues();
      const datos: CrearPedidoModel = {
        ...data,
        fechaRecibido: data.fechaRecibido,
        detallesPedido: data.detallesPedido.map(p => ({
          productoId: p.productoId || '',
          tipoEntrega: p.tipoEntrega || '',
          cantidad: parseFloat(p.cantidad) || 0,
          fechaEntrega: p.fechaEntrega || '',
          lugarEntregaId: p.lugarEntregaId || '',
          unidades: 0,
        })),
      }
      setIsLoading(true)
      const response = await new PedidoService(session.data?.user.token).crear(datos);
      if (response.error) {
        return toast({ title: response.error.message })
      }
      toast({
        title: 'Pedido creado correctamente',
        description: 'Se recomienda gestionar el pedido en funcionalidad Gestionar Pedido'
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-8">
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
                name="fechaRecibido"
                label="Fecha del Pedido"
                defaultValue={new Date()}
                withTime
                disabled
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
                cantidad: '1',
                fechaEntrega: new Date(),
                tipoEntrega: "",
                lugarEntregaId: "",
                productoId: "",
              })}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <CustomFormDatePicker
                      control={form.control}
                      name="fechaEntregaGlobal"
                      label="Fecha de Entrega Global"
                      defaultValue={new Date()}
                    />
                    <FormField
                      control={form.control}
                      name="tipoEntregaGlobal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Entrega Global</FormLabel>
                          <CustomSelect
                            options={TiposEntrega.map((tipo) => ({ value: tipo.id, label: tipo.nombre }))}
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
                      name="lugarEntregaGlobal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lugar de Entrega Global</FormLabel>
                          <FormControl>
                            <SelectWithSearch
                              endpoint="lugar-entrega/search"
                              onSelect={field.onChange}
                              defaultValue={field.value}
                              params={{
                                idCliente,
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
                  <Button type="button" variant="outline" size="sm" className="mt-4" onClick={aplicarValoresGlobales}>
                    Aplicar a todos los productos
                  </Button>
                </CardContent>
              </Card>

              {fields.map((field, index) => {
                const tipoEntrega = detallesPedido?.[index]?.tipoEntrega;
                return (
                  <Card key={field.id}>
                    <CardContent className="pt-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`detallesPedido.${index}.productoId`}
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
                          name={`detallesPedido.${index}.cantidad`}
                          label="Cantidad"
                          type="number"
                        />

                        <CustomFormDatePicker
                          control={form.control}
                          name={`detallesPedido.${index}.fechaEntrega`}
                          label="Fecha de Entrega"
                          defaultValue={new Date()}
                        />

                        <FormField
                          control={form.control}
                          name={`detallesPedido.${index}.tipoEntrega`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Entrega</FormLabel>
                              <CustomSelect
                                options={TiposEntrega.map((tipo) => ({ value: tipo.id, label: tipo.nombre }))}
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
                          disabled={tipoEntrega === TipoEntregaProducto.RECOGE_EN_PLANTA}
                          name={`detallesPedido.${index}.lugarEntregaId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lugar de Entrega</FormLabel>
                              <FormControl>
                                <SelectWithSearch
                                  disabled={tipoEntrega === TipoEntregaProducto.RECOGE_EN_PLANTA}
                                  endpoint="lugar-entrega/search"
                                  onSelect={field.onChange}
                                  defaultValue={field.value}
                                  params={{
                                    idCliente,
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
                )
              })}
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
          <Button
            type="button"
            size="lg"
            isLoading={isLoading}
            onClick={onSubmit}
          >
            Crear Pedido
          </Button>
        </div>
      </form>
    </Form>
  )
}