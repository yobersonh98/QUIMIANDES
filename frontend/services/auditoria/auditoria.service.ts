import { PaginationResponse, PaginationSearchParamsPage } from "@/types/pagination";
import { ApiService } from "../api/ApiService";
import { ErrorResponse, ServiceResponse, SuccessResponse } from "@/core/service/service.response";
import { AuditoriaLogEntity } from "./entities/AuditoriaEntity";

export class AuditoriaService extends ApiService {
  constructor(token?:string) {
    super('auditoria', token)
  }
  async listar(params?: PaginationSearchParamsPage): Promise<ServiceResponse<PaginationResponse<AuditoriaLogEntity[]>>> {
    try {
      const data = await this.makeRequest<PaginationResponse<AuditoriaLogEntity[]>>({
        searchParams: {
          ...params
        }
      })
      return new SuccessResponse(data)
    } catch (error) {
        return ErrorResponse.fromUnknownError(error)
    }
  }

  private static instance:AuditoriaService;
  public static getInstance() {
    if (!this.instance) {
      return new AuditoriaService();
    }
    return this.instance;
  }
}