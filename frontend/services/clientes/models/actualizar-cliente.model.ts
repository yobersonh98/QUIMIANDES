import { CrearClienteModel } from "./crear-cliente.model";

export interface ActualizarClienteModel extends CrearClienteModel{
  id: string;

  idLugaresEntregaEliminar?: string[]
}