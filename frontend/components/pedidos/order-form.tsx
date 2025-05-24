"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { Plus, Settings, Copy, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import SelectWithSearch from "../shared/SelectWithSearch"
import { CustomFormInput } from "../shared/custom-form-input"
import { CustomFormDatePicker } from "../shared/custom-form-date-picker"
import { CustomSelect } from "../shared/custom-select"
import { useSession } from "next-auth/react"
import type { CrearPedidoModel } from "@/services/pedidos/models/crear-pedido.model"
import { PedidoService } from "@/services/pedidos/pedido.service"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { TipoEntregaProducto, TiposEntrega } from "@/core/constantes/pedido"
import { OrderFormSchema, type OrderFormValues } from "./schemas/order-form-schema"
import { Label } from "../ui/label"
import type { DocumentoEntity, PedidoEntity } from "@/services/pedidos/entity/pedido.entity"
import { usePathname, useRouter } from "next/navigation"
import RefreshPage from "@/actions/refresh-page"
import { CompactFileUploader } from "../shared/compact-file-uploader"
import { validarFechaEntrega } from "@/lib/utils"
import { ProductFormItem } from "./product-form-item"

type OrderFormProps = {
  pedido?: PedidoEntity
  pathNameToRefresh?: string
  isGoBack?: boolean
}

export function OrderForm({ pedido, pathNameToRefresh, isGoBack = true }: OrderFormProps) {
  console.log(pedido)
  const session = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const isEditing = !!pedido
  const pathName = usePathname()
  const [files, setFiles] = useState<DocumentoEntity[]>(pedido?.pedidoDocumentos?.map((i) => i.documento) || [])

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      ordenCompra: pedido?.ordenCompra || "",
      idCliente: pedido?.idCliente || "",
      observaciones: pedido?.observaciones || "",
      fechaRecibido: pedido?.fechaRecibido,
      tipoEntregaGlobal: TipoEntregaProducto.ENTREGA_AL_CLIENTE,
      detallesPedido: pedido?.detallesPedido.map((dp) => ({
        id: dp.id,
        productoId: dp.productoId,
        cantidad: new String(dp.cantidad).toString(),
        fechaEntrega: dp.fechaEntrega,
        lugarEntregaId: dp.lugarEntregaId,
        tipoEntrega: dp.tipoEntrega,
        pesoTotal: dp.pesoTotal || 0, // Añadí esta línea
      })) || [
        {
          pesoTotal: 0, // Añadí esta línea para el objeto vacío inicial
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "detallesPedido",
    control: form.control,
  })

  const detallesPedido = useWatch({
    control: form.control,
    name: "detallesPedido",
  })

  const idCliente = useWatch({
    control: form.control,
    name: "idCliente",
  })

  const tipoEntregaGlobal = useWatch({
    control: form.control,
    name: "tipoEntregaGlobal",
  })

  const fechaEntregaGlobal = useWatch({
    control: form.control,
    name: "fechaEntregaGlobal",
  })

  const lugarEntregaGlobal = useWatch({
    control: form.control,
    name: "lugarEntregaGlobal",
  })

  const isGlobalDeliveryLocationDisabled = tipoEntregaGlobal === TipoEntregaProducto.RECOGE_EN_PLANTA

  const aplicarValoresGlobales = () => {
    const valoresGlobales = form.getValues()
    detallesPedido.forEach((detalle, index) => {
      form.setValue(`detallesPedido.${index}.fechaEntrega`, valoresGlobales.fechaEntregaGlobal || new Date())
      form.setValue(`detallesPedido.${index}.tipoEntrega`, valoresGlobales.tipoEntregaGlobal || "")

      if (valoresGlobales.tipoEntregaGlobal !== TipoEntregaProducto.RECOGE_EN_PLANTA) {
        form.setValue(`detallesPedido.${index}.lugarEntregaId`, valoresGlobales.lugarEntregaGlobal)
      } else {
        form.setValue(`detallesPedido.${index}.lugarEntregaId`, "")
      }

      if (detalle.pesoTotal) {
        form.setValue(`detallesPedido.${index}.pesoTotal`, detalle.pesoTotal)
      }
    })

    toast({
      title: "Configuración aplicada",
      description: `Se aplicaron los valores globales a ${detallesPedido.length} producto(s)`,
    })
  }

  useEffect(() => {
    if (tipoEntregaGlobal === TipoEntregaProducto.RECOGE_EN_PLANTA) {
      form.setValue("lugarEntregaGlobal", "")
    }
  }, [tipoEntregaGlobal, form])

  async function onSubmit() {
    try {
      const data: OrderFormValues = form.getValues()
      const datos: CrearPedidoModel = {
        ...data,
        fechaRecibido: data.fechaRecibido,
        pedidoDocumentoIds: files?.map((i) => i.id),
        detallesPedido: data.detallesPedido.map((p) => ({
          id: p.id,
          productoId: p.productoId || "",
          tipoEntrega: p.tipoEntrega || "",
          cantidad: Number.parseFloat(p.cantidad) || 0,
          fechaEntrega: p.fechaEntrega || "",
          lugarEntregaId: p.lugarEntregaId || "",
          unidades: 0,
          pesoTotal: p.pesoTotal || 0, // Añade esta línea
        })),
      }

      const esAlgunaFechaEntregaMal = detallesPedido.some((p) => {
        const fechaEntrega = new Date(p.fechaEntrega)
        try {
          validarFechaEntrega(fechaEntrega)
        } catch (error) {
          if (error instanceof Error) {
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            })
          }
          return true
        }
      })

      if (esAlgunaFechaEntregaMal) {
        return
      }
      setIsLoading(true)
      let response

      if (isEditing && pedido) {
        if (pedido.idCliente !== datos.idCliente) {
          return toast({
            variant: "destructive",
            description: "No puede modificar el cliente",
          })
        }
        response = await new PedidoService(session.data?.user.token).actualizar(pedido.id, datos)
        if (!response.error) {
          toast({
            title: "Pedido actualizado correctamente",
            description: "Los cambios han sido guardados exitosamente",
          })
        }
      } else {
        response = await new PedidoService(session.data?.user.token).crear(datos)
        if (!response.error) {
          toast({
            title: "Pedido creado correctamente",
            description: "Se recomienda gestionar el pedido en funcionalidad Gestionar Pedido",
          })
        }
      }

      if (response.error) {
        return toast({ title: response.error.message })
      }
      await RefreshPage(pathNameToRefresh || pathName)

      if (isGoBack) {
        router.back()
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar el pedido",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Variables para mejorar la UX
  const hasGlobalValues = fechaEntregaGlobal && tipoEntregaGlobal

  return (
    <Form {...form}>
      <form className="space-y-8 mt-6">
        {/* Información básica del pedido */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Información del Pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
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
            <div className="mt-4">
              <label className="text-sm font-medium">Archivos Adjuntos</label>
              <p className="text-xs mb-2 text-muted-foreground">
                Adjunte archivos relevantes para el pedido (PDF, imágenes)
              </p>
              <CompactFileUploader onChange={setFiles} multiple value={files} />
            </div>
          </CardContent>
        </Card>

        {/* Configuración Global */}
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-blue-900 dark:text-blue-100">Configuración Global</CardTitle>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Configure valores que se aplicarán a todos los productos del pedido
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Opcional
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>¿Cómo funciona?</strong> Configure aquí los valores comunes y luego haga clic en &quot;Aplicar a
                todos los productos&quot; para copiar esta configuración a cada producto. Después podrá modificar productos
                individuales si es necesario.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <CustomFormDatePicker
                  control={form.control}
                  name="fechaEntregaGlobal"
                  label="📅 Requerido para"
                  placeholder="Seleccione fecha de entrega"
                  // defaultValue={obtenerFechaEntregaSiguiente()}
                />
                <p className="text-xs text-muted-foreground">Fecha común para todos los productos</p>
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="tipoEntregaGlobal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>🚚 Tipo de Entrega</FormLabel>
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
                <p className="text-xs text-muted-foreground">Método de entrega para todos los productos</p>
              </div>

              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="lugarEntregaGlobal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>📍 Lugar de Entrega</FormLabel>
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
                <p className="text-xs text-muted-foreground">
                  {isGlobalDeliveryLocationDisabled
                    ? "No aplica para recogida en planta"
                    : "Ubicación común para todos los productos"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {hasGlobalValues
                    ? `Configuración lista para aplicar a ${detallesPedido.length} producto(s)`
                    : "Configure los valores arriba para continuar"}
                </span>
              </div>
              <Button
                type="button"
                onClick={aplicarValoresGlobales}
                disabled={!hasGlobalValues}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                size="sm"
              >
                <Copy className="h-4 w-4 mr-2" />
                Aplicar a todos los productos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Productos del Pedido */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <CardTitle>Productos del Pedido ({fields.length})</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <ProductFormItem
                key={field.id}
                index={index}
                onRemove={() => remove(index)}
                isRemoveDisabled={fields.length === 1}
              />
            ))}
            <div className="justify-end flex">
              {!isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      cantidad: "1",
                      fechaEntrega: fechaEntregaGlobal || new Date(),
                      tipoEntrega: tipoEntregaGlobal || TipoEntregaProducto.ENTREGA_AL_CLIENTE,
                      lugarEntregaId: lugarEntregaGlobal || "",
                      productoId: "",
                      pesoTotal: 0,
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Producto
                </Button>
              )}
            </div>
            
          </CardContent>
        </Card>

        {/* Observaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Observaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
            Cancelar
          </Button>

          <Button type="button" size="lg" isLoading={isLoading} onClick={onSubmit}>
            {isEditing ? "Actualizar Pedido" : "Crear Pedido"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
