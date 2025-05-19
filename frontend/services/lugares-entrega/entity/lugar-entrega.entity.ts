import { Municipio } from "@/types/lugares"

export interface LugarEntregaEntity {
  id: string
  nombre: string
  direccion: string
  contacto: string
  telefonoEntregas: string
  idCiudad: string
  clienteId: string

  ciudad?: Municipio
}