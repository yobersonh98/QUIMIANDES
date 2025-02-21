"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ClienteService } from "@/services/clientes/clientes.service"
import { CrearClienteModel } from "@/services/clientes/models/crear-cliente.model"

const clientFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  documentType: z.string().min(1, {
    message: "El tipo de documento es requerido.",
  }),
  documentNumber: z.string().min(1, {
    message: "El número de documento es requerido.",
  }),
  address: z.string().min(1, {
    message: "La dirección es requerida.",
  }),
  zone: z.string().optional(),
  email: z.string().email({
    message: "Ingrese un correo electrónico válido.",
  }),
  phone: z.string().min(1, {
    message: "El teléfono es requerido.",
  }),
})

type ClientFormValues = z.infer<typeof clientFormSchema>

export function ClientForm() {

  const { toast } = useToast()
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      documentType: "",
      documentNumber: "",
      address: "",
      zone: "",
      email: "",
      phone: "",
    },
  })

  async function  onSubmit(data: ClientFormValues) {
    const createClienteModel: CrearClienteModel = {
      nombre: data.name,
      tipoDocumento: data.documentType,
      documento: data.documentNumber,
      direccion: data.address,
      zonaBarrio: data.zone,
    }
    const respose = await ClienteService.getInstance().crear(createClienteModel)
    if (respose.error) {
      return toast({
        title: "Error creando cliente",
        description: respose.error.message
      })
    }
    toast({
      title: "Cliente creado",
      description: "El cliente ha sido creado con éxito."
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razón Social</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="documentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Documento</FormLabel>
              <FormControl>
                <Input placeholder="NIT, Cédula, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="documentNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Documento</FormLabel>
              <FormControl>
                <Input placeholder="Número de documento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Dirección completa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zona/Barrio</FormLabel>
              <FormControl>
                <Input placeholder="Zona o barrio (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input placeholder="correo@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="Número de teléfono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          isLoading={form.formState.isSubmitting}
        
        type="submit">Crear Cliente</Button>
      </form>
    </Form>
  )
}

