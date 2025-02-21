import { ErrorResponse, SuccessResponse } from "@/core/service/service.response";
import { AxiosInstance } from "axios";
import { ClienteEntity } from "./entities/cliente.entity";
import { UnknownError } from "@/core/errors/errors";
import { API } from "@/lib/Api";
import { CrearClienteModel } from "./models/crear-cliente.model";

export class ClienteService {

  constructor(private API: AxiosInstance) {
  }

  async listar():Promise<SuccessResponse<ClienteEntity[]>> {
    try {
      const response = await this.API.get<ClienteEntity[]>("/cliente");
      return new SuccessResponse(response.data);
    } catch (e) {
      console.error(e);
      return new ErrorResponse(new UnknownError("Errror consultando clientes"));
    }
  }

  async consultar(id: string):Promise<SuccessResponse<ClienteEntity>> {
    try {
      const response = await this.API.get<ClienteEntity>(`/cliente/${id}`);
      return new SuccessResponse(response.data);
    } catch (e) {
      console.error(e);
      return new ErrorResponse(new UnknownError("Error consultando cliente"));
    }
  }


  async crear(cliente: CrearClienteModel):Promise<SuccessResponse<ClienteEntity>> {
    try {
      const response = await this.API.post<ClienteEntity>("/cliente", cliente);
      return new SuccessResponse(response.data);
    } catch (e) {
      console.error(e);
      return new ErrorResponse(new UnknownError("Error creando cliente"));
    }
  }

  async actualizar(cliente: ClienteEntity):Promise<SuccessResponse<ClienteEntity>> {
    try {
      const response = await this.API.put<ClienteEntity>(`/cliente/${cliente.documento}`, cliente);
      return new SuccessResponse(response.data);
    } catch (e) {
      console.error(e);
      return new ErrorResponse(new UnknownError("Error actualizando cliente"));
    }
  }
  async eliminar(id: string):Promise<SuccessResponse<ClienteEntity>> {
    try {
      const response = await this.API.delete<ClienteEntity>(`/cliente/${id}`);
      return new SuccessResponse(response.data);
    } catch (e) {
      console.error(e);
      return new ErrorResponse(new UnknownError("Error eliminando cliente"));
    }
  }



  private static instance: ClienteService;
  public static getInstance(): ClienteService {
    if (!this.instance) {
      this.instance = new ClienteService(API);
    }
    return this.instance;
  }
}
