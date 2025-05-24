// components/orders/ProductFormItem.tsx
"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import SelectWithSearch from "../shared/SelectWithSearch"
import { CustomFormDatePicker } from "../shared/custom-form-date-picker"
import { CustomSelect } from "../shared/custom-select"
import { useFormContext, useWatch } from "react-hook-form"
import { OrderFormValues } from "./schemas/order-form-schema"
import { TipoEntregaProducto } from "@/core/constantes/pedido"
import { Input } from "../ui/input"
import { ProductoService } from "@/services/productos/productos.service"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { ProductoEntity } from "@/services/productos/entities/producto.entity"
import { getUnidadMedidaLabel, getTotalLabel } from "@/utils/unidades"

type ProductFormItemProps = {
  index: number
  onRemove: () => void
  isRemoveDisabled: boolean
}

export function ProductFormItem({ index, onRemove, isRemoveDisabled }: ProductFormItemProps) {
  const { control, setValue } = useFormContext<OrderFormValues>()
  const idCliente = useWatch({ control, name: "idCliente" })
  const session = useSession()
  const [producto, setProducto] = useState<ProductoEntity | null>(null)
  
  const tipoEntrega = useWatch({
    control,
    name: `detallesPedido.${index}.tipoEntrega`
  })

  const productoId = useWatch({
    control,
    name: `detallesPedido.${index}.productoId`
  })

  const cantidad = useWatch({
    control,
    name: `detallesPedido.${index}.cantidad`
  })

  // Consultar producto cuando se selecciona
  useEffect(() => {
    const consultarProducto = async () => {
      if (!productoId) {
        setProducto(null)
        return
      }
      
      try {
        const productoService = new ProductoService(session.data?.user.token)
        const response = await productoService.consultar(productoId)
        
        if (response instanceof Error) {
          console.error("Error al consultar producto:", response.message)
          return
        }

        if (response.data) {
          setProducto(response.data)
        }
      } catch (error) {
        console.error("Error al consultar producto:", error)
      }
    }

    consultarProducto()
  }, [productoId, session.data?.user.token])

  // Calcular valor total cuando cambia la cantidad o el producto
  useEffect(() => {
    if (!producto) return;
    
    const cantidadNum = parseFloat(cantidad || '0') || 0;
    const valorTotal = cantidadNum * (producto.pesoVolumen || 0);
    
    setValue(`detallesPedido.${index}.pesoTotal`, valorTotal);
  }, [cantidad, producto, setValue, index]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={control}
            name={`detallesPedido.${index}.productoId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Producto {index+1}</FormLabel>
                <SelectWithSearch
                  endpoint="productos/search"
                  onSelect={(value) => {
                    field.onChange(value)
                  }}
                  value={field.value}
                  placeholder="Seleccione un producto"
                  maperOptions={(producto) => ({ value: producto.id, label: producto.nombre })}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Columna de cantidad con el valor calculado */}
          <div className="flex gap-2">
            <FormItem className="flex-1">
              <FormLabel>Cantidad</FormLabel>
              <div>
                <FormField
                  control={control}
                  name={`detallesPedido.${index}.cantidad`}
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Cantidad"
                        {...field}
                      />
                    </FormControl>
                  )}
                />
              </div>
              <FormMessage />
            </FormItem>
            <FormItem className="flex-1">
              <FormLabel>
                {producto ? getTotalLabel(producto.unidadMedida) : 'Peso Total'}
                {producto && ` (${getUnidadMedidaLabel(producto.unidadMedida)})`}
              </FormLabel>
              <div>
                <Input
                  type="text"
                  value={producto 
                    ? (parseFloat(cantidad || '0') * (producto.pesoVolumen || 0)).toFixed(2)
                    : '0.00'}
                  readOnly
                  disabled
                />
              </div>
              <FormMessage />
            </FormItem>
          </div>

          <CustomFormDatePicker
            control={control}
            name={`detallesPedido.${index}.fechaEntrega`}
            label="Requerida para"
            placeholder="Seleccione una fech de entrega"
          />

          <FormField
            control={control}
            name={`detallesPedido.${index}.tipoEntrega`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Entrega</FormLabel>
                <CustomSelect
                  options={[
                    { value: TipoEntregaProducto.ENTREGA_AL_CLIENTE, label: "Entrega al cliente" },
                    { value: TipoEntregaProducto.RECOGE_EN_PLANTA, label: "Recoge en planta" },
                  ]}
                  onChange={field.onChange}
                  value={field.value}
                  placeholder="Seleccione tipo de entrega"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
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
                    params={{ idCliente }}
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
          onClick={onRemove}
          disabled={isRemoveDisabled}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar Producto
        </Button>
      </CardContent>
    </Card>
  )
}