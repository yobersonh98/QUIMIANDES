import { ApiService } from "../api/ApiService"

export class PresentacionService extends ApiService {
  constructor(token?: string) {
    super('presentacion', token);
  }
}