import { ErrorResponse, ServiceResponse, SuccessResponse } from "@/core/service/service.response";
import { ApiService } from "../api/ApiService";
import { EntregaEntity } from "./entities/entrega.entity";
import { CrearEntregaModel } from "./models/crear-entrega.model";
import { ConfirmarEntregaModel } from "./models/confirmar-despacho..model";
import { CompletarEntregaModel } from "./models/completar-entrega-model";
import { ListarEntregaModel } from "./models/listar-entregas-model";
import { PaginationResponse } from "@/types/pagination";
import { EntregaListadoItemEntity } from "./entities/listado-entrega-item.entity";

export class EntregaPedidoService extends ApiService {
  constructor(token?:string) {
    super('entregas', token)
  }

  async listar(listarEntregaModel: ListarEntregaModel): Promise<ServiceResponse<PaginationResponse<EntregaListadoItemEntity[]>>> {
    try {
      const data = await this.makeRequest<PaginationResponse<EntregaListadoItemEntity[]>>({
        searchParams: {
          ...listarEntregaModel
        }
      })
      return new SuccessResponse(data)
    } catch (error) {
      return ErrorResponse.fromUnknownError(error);
    }
  }
  async crearEntrega(entregaPedidoModel: CrearEntregaModel): Promise<ServiceResponse<EntregaEntity>>{
    try {
      const data = await this.makeRequest<EntregaEntity>({
        method: 'post',
        data:entregaPedidoModel
      })
      return new SuccessResponse(data)
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }
  async modificarEntrega(data: unknown) : Promise<ServiceResponse<EntregaEntity>> {
    try {
      const response  = await this.makeRequest<EntregaEntity>({
        method: 'patch',
        data,
      })
      return new SuccessResponse(response)
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }

  async consultar(id: string): Promise<ServiceResponse<EntregaEntity>> {
    try {
      const response = await this.makeRequest<EntregaEntity>({
        endpoint: `/${id}`
      })
      return new SuccessResponse(response)
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }

  async confirmarEntrega(data:ConfirmarEntregaModel): Promise<ServiceResponse<EntregaEntity>> {
    try {
      const response = await this.makeRequest<EntregaEntity>({
        method: 'patch',
        endpoint: '/confirmar-entrega',
        data
      })
      return new SuccessResponse(response)
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }

  async completarEntrega(data: CompletarEntregaModel): Promise<ServiceResponse<EntregaEntity>> {
    try {
      const response = await this.makeRequest<EntregaEntity>({
        method: 'patch',
        endpoint: '/completar-entrega',
        data
      })
      return new SuccessResponse(response)
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }
  async cancelarEntrega(entregaId:string): Promise<ServiceResponse<EntregaEntity>> {
    try {
      const response = await this.makeRequest<EntregaEntity>({
        method: 'patch',
        endpoint: `/${entregaId}/cancelar`,
      })
      return new SuccessResponse(response)
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }

  static instance: EntregaPedidoService; 
  static getServerIntance() {
    if (!this.instance) {
      this.instance = new EntregaPedidoService()
    }
    return this.instance
  }
}