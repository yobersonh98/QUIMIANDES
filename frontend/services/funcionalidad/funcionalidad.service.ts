// src/modules/funcionalidad/services/funcionalidad.service.ts

import { PaginationResponse, PaginationSearchParamsPage } from "@/types/pagination";
import { ApiService } from "../api/ApiService";
import { ErrorResponse, ServiceResponse, SuccessResponse } from "@/core/service/service.response";
import { FuncionalidadEntity } from "./entity/funcionalidad.entity";
import { CrearFuncionalidadModel } from "./model/crear-funcionalidad.model";
import { ActualizarFuncionalidadModel } from "./model/actualizar-funcionalidad.model";

export class FuncionalidadService extends ApiService {
  constructor(token?: string) {
    super('funcionalidad', token);
  }

  async listar(
    pagination?: PaginationSearchParamsPage
  ): Promise<ServiceResponse<PaginationResponse<FuncionalidadEntity[]>>> {
    try {
      const result = await this.makeRequest<PaginationResponse<FuncionalidadEntity[]>>({
        searchParams: {
          ...pagination
        }
      });
      return new SuccessResponse(result);
    } catch (error) {
      return error as ErrorResponse<PaginationResponse<FuncionalidadEntity[]>>;
    }
  }

  async consultar(id: string): Promise<ServiceResponse<FuncionalidadEntity>> {
    try {
      const result = await this.makeRequest<FuncionalidadEntity>({
        endpoint: '/' + id,
      });
      return new SuccessResponse(result);
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }

  async crear(
    funcionalidad: CrearFuncionalidadModel
  ): Promise<ServiceResponse<FuncionalidadEntity>> {
    try {
      const result = await this.makeRequest<FuncionalidadEntity>({
        method: 'post',
        data: funcionalidad
      });
      return new SuccessResponse(result);
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }

  async modificar(
    funcionalidad: ActualizarFuncionalidadModel
  ): Promise<ServiceResponse<FuncionalidadEntity>> {
    try {
      const result = await this.makeRequest<FuncionalidadEntity>({
        method: 'put',
        endpoint: '/' + funcionalidad.id,
        data: funcionalidad
      });
      return new SuccessResponse(result);
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }

  async eliminar(id: string): Promise<ServiceResponse<boolean>> {
    try {
      await this.makeRequest<void>({
        method: 'delete',
        endpoint: '/' + id,
      });
      return new SuccessResponse(true);
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }

  // Singleton pattern for server-side usage
  private static instance: FuncionalidadService;
  public static getServerInstance(): FuncionalidadService {
    if (!FuncionalidadService.instance) {
      FuncionalidadService.instance = new FuncionalidadService();
    }
    return FuncionalidadService.instance;
  }
}