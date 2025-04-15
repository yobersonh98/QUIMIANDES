import { ErrorResponse, SuccessResponse } from "@/core/service/service.response";
import { ClienteEntity } from "./entities/cliente.entity";
import { CrearClienteModel } from "./models/crear-cliente.model";
import { ApiService } from "../api/ApiService";
import { ActualizarClienteModel } from "./models/actualizar-cliente.model";
import { ListarClientesModel } from "./models/listar-clientes.model";
import { PaginationResponse } from "@/types/pagination";

export class ClienteService  extends ApiService {

  constructor(token?: string) {
    super("/cliente", token);
  }

  async listar(listarClientesModel?: ListarClientesModel):Promise<SuccessResponse<PaginationResponse<ClienteEntity[]>>> {
    try {
      const response = await this.makeRequest<PaginationResponse<ClienteEntity[]>>({
        searchParams: {
          ...listarClientesModel
        }
      });
      return new SuccessResponse(response);
    } catch (e) {
      return ErrorResponse.fromUnknownError(e);
    }
  }

  async consultar(id: string):Promise<SuccessResponse<ClienteEntity>> {
    try {
      const response = await this.makeRequest<ClienteEntity>({ endpoint: `/${id}`});
      return new SuccessResponse(response);
    } catch (e) {
      return ErrorResponse.fromUnknownError(e);
    }
  }


  async crear(cliente: CrearClienteModel):Promise<SuccessResponse<ClienteEntity>> {
    try {
      const data = await this.makeRequest<ClienteEntity>({ method: "post", data: cliente });
      return new SuccessResponse(data);
    } catch (e) {
      return ErrorResponse.fromUnknownError(e);
    }
  }

  async actualizar(cliente: ActualizarClienteModel):Promise<SuccessResponse<ClienteEntity>> {
    try {
      const response = await this.makeRequest<ClienteEntity>({ method: "put", data: cliente, endpoint: `/${cliente.id}` });
      return new SuccessResponse(response);
    } catch (e) {
      return ErrorResponse.fromUnknownError(e);
    }
  }
  async eliminar(id: string):Promise<SuccessResponse<ClienteEntity>> {
    try {
      const response = await this.makeRequest<ClienteEntity>({ method: "delete", endpoint: `/${id}` });
      return new SuccessResponse(response);
    } catch (e) {
      return ErrorResponse.fromUnknownError(e);
    }
  }

  private static instance: ClienteService;
  public static getServerInstance(): ClienteService {
    if (!this.instance) {
      this.instance = new ClienteService();
    }
    return this.instance;
  }

  public static getClientInstance(token: string): ClienteService {
    return new ClienteService(token);
  }

}
