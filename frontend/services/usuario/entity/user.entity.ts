
export interface UserEntity {
  id: string;
  name?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  estado: boolean;
  password?:string
}