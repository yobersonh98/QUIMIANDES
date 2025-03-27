import { ErrorResponse, ServiceResponse, SuccessResponse } from "@/core/service/service.response";
import { ApiService } from "../api/ApiService";
import { EntregaEntity } from "./entities/entrega.entity";
import { CrearEntregaProductoModel } from "./models/crear-entrega-producto";

export class EntregaPedidoService extends ApiService{
  constructor(token?:string) {
    super('entregas', token)
  }
  async crearEntrega(entregaPedidoModel: CrearEntregaProductoModel): Promise<ServiceResponse<EntregaEntity>>{
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
}