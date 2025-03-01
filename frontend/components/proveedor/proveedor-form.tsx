"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { TipoDocumentoArray } from "@/core/constantes/tipo-documentos"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CrearProveedorModel } from "@/services/proveedor/models/crear-proveedor.model"

// Esquema de validación con Zod
const proveedorSchema = z.object({
  documento: z.string().min(1, "El documento es requerido"),
  tipoDocumento: z.enum(TipoDocumentoArray as [string, ...string[]]),
  nombre: z.string().min(1, "El nombre es requerido"),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  facturaIva: z.boolean().default(false),
})

type ProveedorFormValues = z.infer<typeof proveedorSchema>

type ProveedorFormProps = {
  proveedor?: CrearProveedorModel
  onSubmit: (data: CrearProveedorModel) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function ProveedorForm({ proveedor, onSubmit, onCancel, isSubmitting = false }: ProveedorFormProps) {
  // Inicializar el formulario con valores por defecto o los del proveedor existente
  const form = useForm<ProveedorFormValues>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: proveedor || {
      documento: "",
      tipoDocumento: "NIT",
      nombre: "",
      direccion: "",
      telefono: "",
      facturaIva: false,
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data)
  })

  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo de documento */}
          <FormField
            control={form.control}
            name="tipoDocumento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de documento</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo de documento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TipoDocumentoArray.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Número de documento */}
          <FormField
            control={form.control}
            name="documento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de documento</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese número de documento" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Nombre */}
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese nombre del proveedor" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dirección */}
        <FormField
          control={form.control}
          name="direccion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingrese dirección (opcional)"
                  {...field}
                  value={field.value || ""}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>Campo opcional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Teléfono */}
        <FormField
          control={form.control}
          name="telefono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingrese teléfono (opcional)"
                  {...field}
                  value={field.value || ""}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>Campo opcional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Factura IVA */}
        <FormField
          control={form.control}
          name="facturaIva"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Factura con IVA</FormLabel>
                <FormDescription>Marque esta casilla si el proveedor factura con IVA</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            {proveedor ? "Actualizar" : "Crear"} Proveedor
          </Button>
        </div>
      </form>
    </Form>
  )
}

