import { ErrorResponse, ServiceResponse, SuccessResponse } from "@/core/service/service.response";
import { ApiService } from "../api/ApiService";
import { ProductoEntity } from "./entities/producto.entity";
import { ActualizarProductoModel } from "./models/actualizar-producto.model";
import { CrearProductoModel } from "./models/crear-producto.model";
import { PaginationResponse, PaginationSearchParamsPage } from "@/types/pagination";

export class ProductoService extends ApiService {
  constructor(token?: string) {
    super('productos', token);
  }

  async listar(searchParams?:PaginationSearchParamsPage):Promise<SuccessResponse<PaginationResponse<ProductoEntity[]>>> {
    try {
      return new SuccessResponse(await this.makeRequest({
        searchParams: {
          ...searchParams
        }
      }));
    } catch (error) {
      return ErrorResponse.fromUnknownError(error);
    }
  }

  async consultar (id: string):Promise<ServiceResponse<ProductoEntity>> {
    try {
      const response = await this.makeRequest<ProductoEntity>({
        endpoint: '/' + id
      });
      return new SuccessResponse(response);
    } catch (error) {
      return ErrorResponse.fromUnknownError(error);
    }
  }

  async crear(producto: CrearProductoModel):Promise<ServiceResponse<ProductoEntity>> {
    try {
      return this.makeRequest({
        method: 'post',
        data: producto
      });
    } catch (error) {
      return ErrorResponse.fromUnknownError(error);
    }
  }

  async modificar (producto: ActualizarProductoModel):Promise<ServiceResponse<ProductoEntity>> {
    try {
      const response = await this.makeRequest<ProductoEntity>({
        method: 'patch',
        endpoint: '/' + producto.id,
        data: producto
      });
      return new SuccessResponse(response);
    } catch (error) {
      return ErrorResponse.fromUnknownError(error);
    }
  }

  private static instance:ProductoService

  public static getInstance() {
    if (this.instance) {
      return this.instance
    }
    return new ProductoService();
  }
}