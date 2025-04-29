"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UNIDADES_MEDIDA } from "@/core/constantes/productos"
import { ProductoEntity, UnidadMedida } from "@/services/productos/entities/producto.entity"
import { CrearProductoModel } from "@/services/productos/models/crear-producto.model"
import { ActualizarProductoModel } from "@/services/productos/models/actualizar-producto.model"
import SelectWithSearch from "../shared/SelectWithSearch"
import { CustomMultiSelect } from "../shared/custom-multiselect"

// Form schema for validation
const productSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  tipo: z.string().min(1, "El tipo es requerido"),
  unidadMedida: z.enum(UNIDADES_MEDIDA as [UnidadMedida, ...UnidadMedida[]]),
  pesoVolumen: z.coerce.number().positive("Debe ser un número positivo"),
  precioBase: z.coerce.number().positive("Debe ser un número positivo"),
  idProveedor: z.string().min(1, "El proveedor es requerido"),
  idPresentacion: z.string().min(1, "La presentación es requerida"),
})

type ProductFormProps = {
  initialData?: Partial<ProductoEntity>
  onSubmit: (data: CrearProductoModel | ActualizarProductoModel) => void
  isEditing?: boolean
}

export function ProductForm({ initialData, onSubmit, isEditing = false }: ProductFormProps) {
  const [loading, setLoading] = useState(false)

  // Initialize form with default values or initial data
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      tipo: initialData?.tipo || "",
      unidadMedida: initialData?.unidadMedida || "UND",
      pesoVolumen: initialData?.pesoVolumen || 0,
      precioBase: initialData?.precioBase || 0,
      idProveedor: initialData?.idProveedor || "",
      idPresentacion: initialData?.idPresentacion || "",
    },
  })

  // Handle form submission
  const handleSubmit = async (values: z.infer<typeof productSchema>) => {
    setLoading(true)
    try {
      if (isEditing && initialData?.id) {
        await onSubmit({
          id: initialData.id,
          ...values,
        })
      } else {
        await onSubmit(values)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mt-6"> 
      <CardHeader>
        <CardTitle>{isEditing ? "Actualizar Producto" : "Crear Nuevo Producto"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del producto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <CustomMultiSelect
                        values={field.value.split(', ')}
                        onChange={(values)=>{
                          field.onChange(values.join(', '))
                        }}
                        options={[
                          { value: 'Materia Prisma', label: 'Materia Prima'},
                          { value: 'Comercial', label: 'Comercial'},
                          { value: 'Trabajos en Fibra', label:'Trabajos en Fibra'},
                        ]}
                        
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unidadMedida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidad de Medida</FormLabel>
                    <SelectWithSearch 
                      value={field.value}
                      endpoint="productos/unidades-medida"
                      onSelect={field.onChange}
                      maperOptions={(unidad) => ({ value: unidad, label: unidad })}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pesoVolumen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso/Volumen</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precioBase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Base</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idProveedor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proveedor</FormLabel>
                    <SelectWithSearch
                      endpoint="proveedores/search"
                      value={field.value}
                      onSelect={field.onChange}
                      maperOptions={(provider) => ({ value: provider.id, label: provider.nombre })}
                     />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idPresentacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presentación</FormLabel>
                    <SelectWithSearch
                      value={field.value}
                      endpoint="presentacion/search"
                      onSelect={field.onChange}
                      maperOptions={(presentation) => ({ value: presentation.id, label: presentation.nombre })}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">

            <Button type="submit" disabled={loading}>
              {loading ? "Procesando..." : isEditing ? "Actualizar" : "Crear Producto"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

