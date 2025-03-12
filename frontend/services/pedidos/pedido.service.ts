import { ErrorResponse, ServiceResponse, SuccessResponse } from "@/core/service/service.response";
import { ApiService } from "../api/ApiService";
import { CrearPedidoModel } from "./models/crear-pedido.model";
import { PedidoEntity } from "./entity/pedido.entity";

export class PedidoService extends ApiService {
  constructor(token?:string) {
    super('pedidos', token);
  }

  async crear(datos:CrearPedidoModel):Promise<ServiceResponse<PedidoEntity>> {
    try {
      const data = await this.makeRequest<PedidoEntity>({
        data: datos,
      })
      return new SuccessResponse(data);
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }

  private static instance: PedidoService

  public static getServerIntance(): PedidoService{
    if (!this.instance) {
      return new PedidoService();
    }
    return this.instance;
  }
}