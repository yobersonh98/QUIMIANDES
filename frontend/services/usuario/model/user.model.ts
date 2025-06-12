
export interface CrearUserModel {
  name?: string;
  email: string;
  password: string;
  estado?: boolean
}

export interface ActualizarUserModel extends Partial<CrearUserModel> {
  id?: string;
}