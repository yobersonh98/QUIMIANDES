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
import { useState, useEffect } from "react"
import { TipoEntregaProducto, TiposEntrega } from "@/core/constantes/pedido"
import { OrderFormSchema, OrderFormValues } from "./schemas/order-form-schema"
import { Label } from "../ui/label"
import { DocumentoEntity, PedidoEntity } from "@/services/pedidos/entity/pedido.entity"
import { usePathname, useRouter } from "next/navigation"
import RefreshPage from "@/actions/refresh-page"
import { CompactFileUploader } from "../shared/compact-file-uploader"


type OrderFormProps = {
  pedido?: PedidoEntity,
  pathNameToRefresh?: string
  isGoBack?: boolean
}

export function OrderForm({ pedido, pathNameToRefresh, isGoBack = true }: OrderFormProps) {
  const session = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isEditing = !!pedido;
  const pathName = usePathname()
  const [files, setFiles] = useState<DocumentoEntity[]>(pedido?.pedidoDocumentos?.map(i=> i.documento) || []);
  
  // Inicializar el formulario con valores por defecto o con los del pedido si está en modo edición
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      ordenCompra: pedido?.ordenCompra,
      idCliente: pedido?.idCliente || '',
      observaciones: pedido?.observaciones,
      fechaRecibido: pedido?.fechaRecibido,
      tipoEntregaGlobal: TipoEntregaProducto.ENTREGA_AL_CLIENTE, // Valor por defecto
      detallesPedido: pedido?.detallesPedido.map(dp => ({
        id: dp.id,
        productoId: dp.productoId,
        cantidad: new String(dp.cantidad).toString(),
        fechaEntrega: dp.fechaEntrega,
        lugarEntregaId: dp.lugarEntregaId,
        tipoEntrega: dp.tipoEntrega
      })) || [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "detallesPedido",
    control: form.control,
  });
  
  const detallesPedido = useWatch({
    control: form.control,
    name: "detallesPedido",
  });

  const idCliente = useWatch({
    control: form.control,
    name: "idCliente"
  });
  
  // Observar el tipo de entrega global para controlar el estado del campo de lugar de entrega
  const tipoEntregaGlobal = useWatch({
    control: form.control,
    name: "tipoEntregaGlobal"
  });
  
  // Determinar si el campo de lugar de entrega global debe estar deshabilitado
  const isGlobalDeliveryLocationDisabled = tipoEntregaGlobal === TipoEntregaProducto.RECOGE_EN_PLANTA;

  const aplicarValoresGlobales = () => {
    const valoresGlobales = form.getValues();
    detallesPedido.forEach((_, index) => {
      form.setValue(`detallesPedido.${index}.fechaEntrega`, valoresGlobales.fechaEntregaGlobal || new Date());
      form.setValue(`detallesPedido.${index}.tipoEntrega`, valoresGlobales.tipoEntregaGlobal || '');
      
      // Aplicar lugar de entrega global solo si el tipo de entrega no es "Recoge en Planta"
      if (valoresGlobales.tipoEntregaGlobal !== TipoEntregaProducto.RECOGE_EN_PLANTA) {
        form.setValue(`detallesPedido.${index}.lugarEntregaId`, valoresGlobales.lugarEntregaGlobal);
      } else {
        // Si el tipo es "Recoge en Planta", limpiar el lugar de entrega
        form.setValue(`detallesPedido.${index}.lugarEntregaId`, '');
      }
    });
  };

  // Cuando cambie el tipo de entrega global, si es "Recoge en Planta", limpiar el valor del lugar de entrega global
  useEffect(() => {
    if (tipoEntregaGlobal === TipoEntregaProducto.RECOGE_EN_PLANTA) {
      form.setValue("lugarEntregaGlobal", "");
    }
  }, [tipoEntregaGlobal, form]);

  async function onSubmit() {
    try {
      const data: OrderFormValues = form.getValues();
      const datos: CrearPedidoModel = {
        ...data,
        fechaRecibido: data.fechaRecibido,
        pedidoDocumentoIds: files?.map(i => i.id),
        detallesPedido: data.detallesPedido.map(p => ({
          id: p.id,
          productoId: p.productoId || '',
          tipoEntrega: p.tipoEntrega || '',
          cantidad: parseFloat(p.cantidad) || 0,
          fechaEntrega: p.fechaEntrega || '',
          lugarEntregaId: p.lugarEntregaId || '',
          unidades: 0,
        })),
      };

      setIsLoading(true);
      let response;

      if (isEditing && pedido) {
        // Actualizar pedido existente
        response = await new PedidoService(session.data?.user.token).actualizar(pedido.id, datos);
        if (!response.error) {
          toast({
            title: 'Pedido actualizado correctamente',
            description: 'Los cambios han sido guardados exitosamente'
          });
        }
      } else {
        // Crear nuevo pedido
        response = await new PedidoService(session.data?.user.token).crear(datos);
        if (!response.error) {
          toast({
            title: 'Pedido creado correctamente',
            description: 'Se recomienda gestionar el pedido en funcionalidad Gestionar Pedido'
          });
        }
      }

      if (response.error) {
        return toast({ title: response.error.message });
      }
      await RefreshPage(pathNameToRefresh || pathName)

      // Redireccionar a la lista de pedidos después de un éxito
      if (isGoBack) {
        router.back();
      }

    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error al procesar el pedido',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form} >
      <form className="space-y-8 mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-3 md:grid-cols-2">
              <FormField
                control={form.control}
                name="idCliente"
                render={({ field }) => (
                  <FormItem>
                    <Label required>Cliente</Label> 
                    <SelectWithSearch
                      endpoint="cliente/search"
                      value={field.value}
                      onSelect={field.onChange}
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
            <div className="mt-2">
              <label className="text-sm font-medium">Archivos Adjuntos</label>
              <p className="text-xs mb-2 text-muted-foreground">Adjunte archivos relevantes para el pedido (PDF, imágenes)</p>
              <CompactFileUploader 
                onChange={setFiles}
                multiple
                value={files}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Productos</h3>
              {/* Mostrar el botón "Agregar Producto" solo cuando NO estamos en modo de edición */}
              {!isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({
                    cantidad: '1',
                    fechaEntrega: new Date(),
                    tipoEntrega: TipoEntregaProducto.ENTREGA_AL_CLIENTE,
                    lugarEntregaId: "",
                    productoId: "",
                  })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Producto
                </Button>
              )}
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
                            value={field.value}
                            placeholder="Seleccione tipo de entrega"
                            defaultValue={TipoEntregaProducto.ENTREGA_AL_CLIENTE}
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
                              disabled={isGlobalDeliveryLocationDisabled}
                              endpoint="lugar-entrega/search"
                              onSelect={field.onChange}
                              value={field.value}
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
                                value={field.value}
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
                                value={field.value}
                                placeholder="Seleccione tipo de entrega"
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
                                  value={field.value}
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

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-4"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
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
            variant="outline"
            size="lg"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            size="lg"
            isLoading={isLoading}
            onClick={onSubmit}
          >
            {isEditing ? 'Actualizar Pedido' : 'Crear Pedido'}
          </Button>
        </div>
      </form>
    </Form>
  )
}