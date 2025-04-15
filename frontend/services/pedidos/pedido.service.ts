import { ErrorResponse, ServiceResponse, SuccessResponse } from "@/core/service/service.response";
import { ApiService } from "../api/ApiService";
import { CrearPedidoModel } from "./models/crear-pedido.model";
import { PedidoDataTable, PedidoEntity } from "./entity/pedido.entity";
import { PaginationResponse, PaginationSearchParamsPage } from "@/types/pagination";
import { EditarPedidoModel } from "./models/editar-pedido.model";

export class PedidoService extends ApiService {
  constructor(token?:string) {
    super('pedidos', token);
  }

  async crear(datos:CrearPedidoModel):Promise<ServiceResponse<PedidoEntity>> {
    try {
      const data = await this.makeRequest<PedidoEntity>({
        data: datos,
        method:'post'
      })
      return new SuccessResponse(data);
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }

  async listar(paginationDto: PaginationSearchParamsPage): Promise<ServiceResponse<PaginationResponse<PedidoDataTable[]>>> {
    try {
      const data = await this.makeRequest<PaginationResponse<PedidoDataTable[]>>({
        searchParams: {
          ...paginationDto,
        }
      })
      return new SuccessResponse(data);
    } catch (error) {
      return ErrorResponse.fromUnknownError(error);
    }
  }

  async actualizar(pedidoId:string, pedidoDto:EditarPedidoModel){
    try {
      const data = await this.makeRequest<PedidoEntity>({
        method: 'patch',
        data:pedidoDto,
        endpoint:'/' + pedidoId
      })
      return new SuccessResponse(data);
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }

  async consultar(pedidoId:string): Promise<ServiceResponse<PedidoEntity>> {
    try {
      const data = await this.makeRequest<PedidoEntity>({
        endpoint:'/' + pedidoId
      });
      return new SuccessResponse(data);
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }

  async finalizarEntregaPedido(pedidoId:string): Promise<ServiceResponse<PedidoEntity>> {
    try {
      const data = await this.makeRequest<PedidoEntity>({
        method: 'post',
        endpoint: `/${pedidoId}/finalizar-entrega`,
      })
      return new SuccessResponse(data);
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }
  async cancelarPedido(pedidoId:string): Promise<ServiceResponse<PedidoEntity>> {
    try {
      const data = await this.makeRequest<PedidoEntity>({
        method: 'post',
        endpoint: `/${pedidoId}/cancelar`,
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