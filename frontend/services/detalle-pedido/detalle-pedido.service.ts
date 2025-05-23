import { ErrorResponse, ServiceResponse, SuccessResponse } from "@/core/service/service.response";
import { ApiService } from "../api/ApiService";
import { DetallePedidoEntity } from "./entity/detalle-pedido.entity";
import { UpdateDetallePedidoModel } from "./models/update-detalle-pedido.model";

export class DetallePedidoService extends ApiService {
  constructor(token?:string) {
    super('detalle-pedido', token);
  }
  private static instance: DetallePedidoService
  public static getServerInstance () {
    if (this.instance) return this.instance;
    return new DetallePedidoService();
  }

  async actualizar(datos:UpdateDetallePedidoModel):Promise<ServiceResponse<DetallePedidoEntity>> {
    try {
      const data = await this.makeRequest<DetallePedidoEntity>({
        data: datos,
        endpoint: '/'+ datos.id,
        method: 'patch'
      })
      return new SuccessResponse(data);
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }

}