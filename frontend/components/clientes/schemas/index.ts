import { z } from 'zod'

export const clientFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  documentType: z.string().min(1, { message: "El tipo de documento es requerido." }),
  documentNumber: z.string().min(1, { message: "El número de documento es requerido." }),
  address: z.string().min(1, { message: "La dirección es requerida." }),
  zone: z.string().optional(),
  email: z.string().email({ message: "Ingrese un correo electrónico válido." }),
  phone: z.string().min(1, { message: "El teléfono es requerido." }),
  idMunicipio: z.string().min(1, { message: 'El municipio es requerido' }),
})

export const deliveryLocationSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  idCiudad: z.string().min(1, { message: "La ciudad es requerida" }),
  direccion: z.string().min(1, { message: "La dirección es requerida" }),
  contacto: z.string().min(1, { message: "El contacto es requerido" }),
})
