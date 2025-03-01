import { PaginationResponse, PaginationSearchParamsPage } from "@/types/pagination";
import { ApiService } from "../api/ApiService";
import { ProveedorEntity } from "./entities/proveedor.entity";
import { ErrorResponse, ServiceResponse, SuccessResponse } from "@/core/service/service.response";
import { ActualizarProveedorModel } from "./models/actualizar-proveedor.model";
import { CrearProveedorModel } from "./models/crear-proveedor.model";

export class ProveedorService extends ApiService {
  constructor(token?: string) {
    super('proveedores', token);
  }

  async listar(pagination: PaginationSearchParamsPage): Promise<ServiceResponse<PaginationResponse<ProveedorEntity[]>>> {
    try {
      const result = await this.makeRequest<PaginationResponse<ProveedorEntity[]>>({
        searchParams: {
          ...pagination
        }
      })
      return new SuccessResponse(result);
    } catch (error) {
      return error as ErrorResponse<PaginationResponse<ProveedorEntity[]>>;
    }
  }

  async modificar(proveedor: ActualizarProveedorModel): Promise<ServiceResponse<ProveedorEntity>> {
    try {
      const result = await this.makeRequest<ProveedorEntity>({
        method: 'patch',
        endpoint: '/' + proveedor.id,
        data: proveedor
      });
      return new SuccessResponse(result);
    } catch (error) {
      return error as ErrorResponse<ProveedorEntity>;
    }
  }

  async consultar(id: string): Promise<ServiceResponse<ProveedorEntity>> {
    try {
      const result = await this.makeRequest<ProveedorEntity>({
        endpoint: '/' + id,
      });
      return new SuccessResponse(result);
    } catch (error) {
      return error as ErrorResponse<ProveedorEntity>;
    }
  }

  async crear(proveedor: CrearProveedorModel): Promise<ServiceResponse<ProveedorEntity>> {
    try {
      const result = await this.makeRequest<ProveedorEntity>({
        method: 'post',
        data: proveedor
      });
      return new SuccessResponse(result);
    } catch (error) {
      return error as ErrorResponse<ProveedorEntity>;
    }
  }

  private static instance: ProveedorService;
  public static getServerInstance(): ProveedorService {
    if (!ProveedorService.instance) {
      ProveedorService.instance = new ProveedorService();
    }
    return ProveedorService.instance;
  }
}