import { PaginationSearchParamsPage } from "@/types/pagination";
import { EstadoEntrega } from "../entities/entrega.entity";

export interface ListarEntregaModel extends PaginationSearchParamsPage {
  estado?: EstadoEntrega
}