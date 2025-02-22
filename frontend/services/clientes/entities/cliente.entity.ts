
// model Cliente {
//   documento      String   @id // NIT o número de documento como clave primaria
//   tipoDocumento  String   // Tipo de documento (e.g., NIT, cédula)
//   nombre         String
//   direccion      String
//   zonaBarrio     String?
//   inventarios    InventarioCliente[]
//   pedidos        Pedido[]
//   cotizaciones   Cotizacion[]

import { LugarEntregaEntity } from "@/services/lugares-entrega/entity/lugar-entrega.entity"

// }
export interface ClienteEntity {
  id : string
  documento: string
  tipoDocumento: string
  nombre: string
  direccion: string
  zonaBarrio: string
  idMunicipio: string

  email?: string
  telefono?: string

  lugaresEntrega: LugarEntregaEntity[]

  // inventarios: InventarioClienteEntity[]
  // pedidos: PedidoEntity[]
  // cotizaciones: CotizacionEntity[]
}