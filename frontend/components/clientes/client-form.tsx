"use client"

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowRight, X } from "lucide-react"
import SelectWithSearch from "../shared/SelectWithSearch"
import { BACKEND_URL } from "@/config/envs"
import { ClienteService } from '@/services/clientes/clientes.service';
import { CrearClienteModel } from '@/services/clientes/models/crear-cliente.model';
import { CrearLugarEntregaModel } from '@/services/lugares-entrega/mode/crear-lugar-entrega.mode';
import { CustomSelect } from '../shared/custom-select';
import { TipoDocumentoArray } from '@/core/constantes/tipo-documentos';

// Extend the client form schema to include delivery locations
const clientFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  documentType: z.string().min(1, { message: "El tipo de documento es requerido." }),
  documentNumber: z.string().min(1, { message: "El número de documento es requerido." }),
  address: z.string().min(1, { message: "La dirección es requerida." }),
  zone: z.string().optional(),
  email: z.string().email({ message: "Ingrese un correo electrónico válido." }),
  phone: z.string().min(1, { message: "El teléfono es requerido." }),
  idMunicipio: z.string().min(1, { message: 'El municipio es requerido' }),
})

const deliveryLocationSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  idCiudad: z.string().min(1, { message: "La ciudad es requerida" }),
  direccion: z.string().min(1, { message: "La dirección es requerida" }),
  contacto: z.string().min(1, { message: "El contacto es requerido" }),
})

type ClientFormValues = z.infer<typeof clientFormSchema>
type DeliveryLocation = z.infer<typeof deliveryLocationSchema>

export function ClientForm() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deliveryLocations, setDeliveryLocations] = useState<CrearLugarEntregaModel[]>([])
  const { toast } = useToast()

  const clientForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      documentType: "",
      documentNumber: "",
      address: "",
      zone: "",
      email: "",
      phone: "",
      idMunicipio: "",
    },
  })

  const deliveryForm = useForm<DeliveryLocation>({
    resolver: zodResolver(deliveryLocationSchema),
    defaultValues: {
      nombre: "",
      idCiudad: "",
      direccion: "",
      contacto: "",
    },
  })


  const handleAddDeliveryLocation = (data: DeliveryLocation) => {
    setDeliveryLocations([...deliveryLocations, data])
    setIsModalOpen(false)
    deliveryForm.reset()
    toast({
      title: "Lugar de entrega añadido",
      description: "El lugar de entrega ha sido agregado exitosamente."
    })
  }

  const removeDeliveryLocation = (index: number) => {
    setDeliveryLocations(deliveryLocations.filter((_, i) => i !== index))
  }

  async function onSubmit(data: ClientFormValues) {
    const createClienteModel: CrearClienteModel = {
      nombre: data.name,
      tipoDocumento: data.documentType,
      documento: data.documentNumber,
      direccion: data.address,
      zonaBarrio: data.zone,
      idMunicipio: data.idMunicipio,
      telefono: data.phone,
      email: data.email,
      lugaresEntrega: deliveryLocations,
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
    clientForm.reset()
    setDeliveryLocations([])
  }

  return (
    <div>
    <h3 className="font-semibold text-3xl mb-6">Nuevo Cliente</h3>
      <div className="flex gap-6 flex-wrap">
      <div className="flex-1">
        <Form {...clientForm}>
          <form onSubmit={clientForm.handleSubmit(onSubmit)} className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First row */}
              <FormField
                control={clientForm.control}
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
                control={clientForm.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Documento</FormLabel>
                    <FormControl>
                      <CustomSelect {...field} options={
                        TipoDocumentoArray.map((tipo) => ({ value: tipo, label: tipo }))
                      } />
                      {/* <Input placeholder="NIT, Cédula, etc." {...field} /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Second row */}
              <FormField
                control={clientForm.control}
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
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <SelectWithSearch
                    apiUrl={BACKEND_URL}
                    maperOptions={(item) => ({ value: item.id, label: item.nombre })}
                    endpoint="municipio"
                    onSelect={(value) => clientForm.setValue("idMunicipio", value)}
                    placeholder="Seleccione un municipio"
                  />
                </FormControl>
              </FormItem>

              {/* Third row - Full width items */}
              <div className="col-span-1 md:col-span-2">
                <FormField
                  control={clientForm.control}
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
              </div>

              {/* Fourth row */}
              <FormField
                control={clientForm.control}
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
                control={clientForm.control}
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

              {/* Fifth row */}
              <FormField
                control={clientForm.control}
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
            </div>

            <div className="flex justify-between items-center mt-4">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" className='flex gap-1'>
                    Agregar Lugar de Entrega <ArrowRight size={18} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nuevo Lugar de Entrega</DialogTitle>
                  </DialogHeader>
                  <Form {...deliveryForm}>
                    <form className="space-y-4">
                      <FormField
                        control={deliveryForm.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre del lugar" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                          <SelectWithSearch
                            apiUrl={BACKEND_URL}
                            maperOptions={(item) => ({ value: item.id, label: item.nombre })}
                            endpoint="municipio"
                            onSelect={(value) => deliveryForm.setValue("idCiudad", value)}
                            placeholder="Seleccione un municipio"
                          />
                        </FormControl>
                      </FormItem>

                      <FormField
                        control={deliveryForm.control}
                        name="direccion"
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
                        control={deliveryForm.control}
                        name="contacto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contacto</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre del contacto" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        onClick={deliveryForm.handleSubmit(handleAddDeliveryLocation)}
                        type='button' className="w-full">
                        Agregar
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Button type="submit" isLoading={clientForm.formState.isSubmitting}>
                Crear Cliente
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className=" md:w-1/3 w-full space-y-4">
        <h3 className="font-semibold">Lugares de Entrega</h3>
        {deliveryLocations.length === 0 && (
          <p className="text-sm">No se han agregado lugares de entrega.</p>
        )}
        {deliveryLocations.map((location, index) => (
          <Card key={index} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => removeDeliveryLocation(index)}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardHeader>
              <CardTitle className="text-lg">{location.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p><strong>Dirección:</strong> {location.direccion}</p>
                <p><strong>Contacto:</strong> {location.contacto}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </div>
  )
}

export default ClientForm;