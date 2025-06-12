// src/modules/user/services/user.service.ts

import { PaginationResponse, PaginationSearchParamsPage } from "@/types/pagination";
import { ApiService } from "../api/ApiService";
import { ErrorResponse, ServiceResponse, SuccessResponse } from "@/core/service/service.response";
import { UserEntity } from "./entity/user.entity";
import { ActualizarUserModel, CrearUserModel } from "./model/user.model";


export class UserService extends ApiService {
  constructor(token?: string) {
    super('user', token);
  }

  async listar(
    pagination?: PaginationSearchParamsPage
  ): Promise<ServiceResponse<PaginationResponse<UserEntity[]>>> {
    try {
      const result = await this.makeRequest<PaginationResponse<UserEntity[]>>({
        searchParams: {
          ...pagination
        }
      });
      return new SuccessResponse(result);
    } catch (error) {
      return error as ErrorResponse<PaginationResponse<UserEntity[]>>;
    }
  }

  async obtener(id: string): Promise<ServiceResponse<UserEntity>> {
    try {
      const result = await this.makeRequest<UserEntity>({
        endpoint: '/' + id,
      });
      return new SuccessResponse(result);
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }

  async crear(
    user: CrearUserModel
  ): Promise<ServiceResponse<UserEntity>> {
    try {
      const result = await this.makeRequest<UserEntity>({
        method: 'post',
        data: user
      });
      return new SuccessResponse(result);
    } catch (error) {
      return ErrorResponse.fromUnknownError(error)
    }
  }

  async actualizar(
    user: ActualizarUserModel
  ): Promise<ServiceResponse<UserEntity>> {
    try {
      const result = await this.makeRequest<UserEntity>({
        method: 'put',
        endpoint: '/' + user.id,
        data: user
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
  private static instance: UserService;
  public static getServerInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
}