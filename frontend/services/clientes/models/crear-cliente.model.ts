export interface CrearClienteModel {
  documento: string
  tipoDocumento: string
  nombre: string
  direccion: string
  zonaBarrio?: string
  idMunicipio: string
  email?: string
  telefono?: string 
}