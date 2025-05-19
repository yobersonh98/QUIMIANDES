"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowRight, X } from "lucide-react";
import SelectWithSearch from "../shared/SelectWithSearch";
import { BACKEND_URL } from "@/config/envs";
import { ClienteService } from "@/services/clientes/clientes.service";
import { CrearClienteModel } from "@/services/clientes/models/crear-cliente.model";
import { ActualizarClienteModel } from "@/services/clientes/models/actualizar-cliente.model";
import { CrearLugarEntregaModel } from "@/services/lugares-entrega/mode/crear-lugar-entrega.mode";
import { CustomSelect } from "../shared/custom-select";
import { TipoDocumentoArray } from "@/core/constantes/tipo-documentos";
import { useSession } from "next-auth/react";
import { clientFormSchema, deliveryLocationSchema } from "./schemas";
import { ClientFormValues, DeliveryLocation } from "./types";

type ClientFormProps = {
  mode?: "create" | "edit";
  clientData?: ActualizarClienteModel;
  onSuccess?: () => void;
};

export function ClientForm({ mode = "create", clientData, onSuccess }: ClientFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveryLocations, setDeliveryLocations] = useState<CrearLugarEntregaModel[]>([]);
  const [locationsToDelete, setLocationsToDelete] = useState<string[]>([]);
  const { toast } = useToast();
  const session = useSession();

  const clientForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      documentType: "",
      documentNumber: "",
      address: "",
      zone: "",
      email: "",
      mainContact: "",
      mainPhone: "",
      contactPayment: "",
      phonePayment: "",
      idMunicipio: "",
    },
  });

  const deliveryForm = useForm<DeliveryLocation>({
    resolver: zodResolver(deliveryLocationSchema),
    defaultValues: {
      nombre: "",
      idCiudad: "",
      direccion: "",
      contacto: "",
      telefonoEntregas: "",
    },
  });

  // Load client data when in edit mode
  useEffect(() => {
    if (mode === "edit" && clientData) {
      clientForm.reset({
        name: clientData.nombre,
        documentType: clientData.tipoDocumento,
        documentNumber: clientData.documento,
        address: clientData.direccion,
        zone: clientData.zonaBarrio || "",
        email: clientData.email || "",
        mainContact: clientData.contactoPrincipal || "",
        mainPhone: clientData.telefono || "",
        contactPayment: clientData.contactoPagos || "",
        phonePayment: clientData.telefonoPagos || "",
        idMunicipio: clientData.idMunicipio,
      });

      if (clientData.lugaresEntrega) {
        setDeliveryLocations(clientData.lugaresEntrega);
      }
    }
  }, [mode, clientData, clientForm]);

  const handleAddDeliveryLocation = (data: DeliveryLocation) => {
    setDeliveryLocations([...deliveryLocations, data]);
    setIsModalOpen(false);
    deliveryForm.reset();
    toast({
      title: "Lugar de entrega añadido",
      description: "El lugar de entrega ha sido agregado exitosamente.",
    });
  };

  const removeDeliveryLocation = (index: number) => {
    const location = deliveryLocations[index];
    if (location.id) {
      setLocationsToDelete([...locationsToDelete, location.id]);
    }
    setDeliveryLocations(deliveryLocations.filter((_, i) => i !== index));
  };

  async function onSubmit(data: ClientFormValues) {
    if (mode === "create") {
      const createClienteModel: CrearClienteModel = {
        nombre: data.name,
        tipoDocumento: data.documentType,
        documento: data.documentNumber,
        direccion: data.address,
        zonaBarrio: data.zone,
        idMunicipio: data.idMunicipio,
        contactoPrincipal: data.mainContact,
        telefono: data.mainPhone,
        contactoPagos: data.contactPayment,
        telefonoPagos: data.phonePayment,
        email: data.email,
        lugaresEntrega: deliveryLocations,
      };
      
      const response = await new ClienteService(session.data?.user.token).crear(
        createClienteModel
      );
      
      if (response.error) {
        return toast({
          title: "Error creando cliente",
          description: response.error.message,
          variant: "destructive",
        });
      }
      
      toast({
        title: "Cliente creado",
        description: "El cliente ha sido creado con éxito.",
      });
      clientForm.reset();
      setDeliveryLocations([]);
    } else if (mode === "edit" && clientData) {
      const updateClienteModel: ActualizarClienteModel = {
        id: clientData.id,
        nombre: data.name,
        tipoDocumento: data.documentType,
        documento: data.documentNumber,
        direccion: data.address,
        zonaBarrio: data.zone,
        idMunicipio: data.idMunicipio,
        contactoPrincipal: data.mainContact,
        telefono: data.mainPhone,
        contactoPagos: data.contactPayment,
        telefonoPagos: data.phonePayment,
        email: data.email,
        lugaresEntrega: deliveryLocations,
        idLugaresEntregaEliminar: locationsToDelete.length > 0 ? locationsToDelete : undefined,
      };
      
      const response = await new ClienteService(session.data?.user.token).actualizar(
        updateClienteModel
      );
      
      if (response.error) {
        return toast({
          title: "Error actualizando cliente",
          description: response.error.message,
          variant: "destructive",
        });
      }
      
      toast({
        title: "Cliente actualizado",
        description: "El cliente ha sido actualizado con éxito.",
      });
    }

    if (onSuccess) {
      onSuccess();
    }
  }

  return (
    <div>
      <div className="flex gap-6 flex-wrap">
        <div className="flex-1">
          <Form {...clientForm}>
            <form
              onSubmit={clientForm.handleSubmit(onSubmit)}
              className="space-y-2"
            >
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
                        <CustomSelect
                          {...field}
                          options={TipoDocumentoArray.map((tipo) => ({
                            value: tipo,
                            label: tipo,
                          }))}
                        />
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
                <FormField
                  control={clientForm.control}
                  name="idMunicipio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <SelectWithSearch
                          apiUrl={BACKEND_URL}
                          maperOptions={(item) => ({
                            value: item.id,
                            label: item.nombre,
                          })}
                          endpoint="municipio"
                          value={field.value}
                          onSelect={field.onChange}
                          placeholder="Seleccione un municipio"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        <Input
                          placeholder="Zona o barrio (opcional)"
                          {...field}
                        />
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
                  name="mainContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contacto (Principal)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del contacto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={clientForm.control}
                  name="mainPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono (principal)</FormLabel>
                      <FormControl>
                        <Input placeholder="Número de teléfono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* sixth row */}
                <FormField
                  control={clientForm.control}
                  name="contactPayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contacto de pagos</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del contacto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={clientForm.control}
                  name="phonePayment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono de pagos</FormLabel>
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
                    <Button
                      type="button"
                      variant="outline"
                      className="flex gap-1"
                    >
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
                                <Input
                                  placeholder="Nombre del lugar"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={deliveryForm.control}
                          name="idCiudad"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ciudad</FormLabel>
                              <FormControl>
                                <SelectWithSearch
                                  apiUrl={BACKEND_URL}
                                  maperOptions={(item) => ({
                                    value: item.id,
                                    label: item.nombre,
                                  })}
                                  endpoint="municipio"
                                  value={field.value}
                                  onSelect={field.onChange}
                                  placeholder="Seleccione una ciudad"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={deliveryForm.control}
                          name="direccion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dirección</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Dirección completa"
                                  {...field}
                                />
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
                              <FormLabel>Contacto de entregas</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Nombre del contacto"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={deliveryForm.control}
                          name="telefonoEntregas"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefono de entregas</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Numero de telefono"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          onClick={deliveryForm.handleSubmit(
                            handleAddDeliveryLocation
                          )}
                          type="button"
                          className="w-full"
                        >
                          Agregar
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                <Button
                  type="submit"
                  isLoading={clientForm.formState.isSubmitting}
                >
                  {mode === "create" ? "Crear Cliente" : "Actualizar Cliente"}
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
                  <p>
                    <strong>Dirección:</strong> {location.direccion}
                  </p>
                  <p>
                    <strong>Contacto:</strong> {location.contacto}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {location.telefonoEntregas}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClientForm;