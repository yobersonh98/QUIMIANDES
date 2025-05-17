import { CrearLugarEntregaModel } from "@/services/lugares-entrega/mode/crear-lugar-entrega.mode"

export interface CrearClienteModel {
  documento: string
  tipoDocumento: string
  nombre: string
  direccion: string
  zonaBarrio?: string
  idMunicipio: string
  email?: string
  contactoPrincipal?: string
  telefono?: string 
  contactoPagos?: string
  telefonoPagos?: string

  lugaresEntrega?: CrearLugarEntregaModel[]
}