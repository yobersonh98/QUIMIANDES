// src/modules/funcionalidad/models/actualizar-funcionalidad.model.ts

export interface ActualizarFuncionalidadModel {
  id: string;
  nombre?: string;
  descripcion?: string;
  ruta?: string;
  activo?: boolean;
  icon?: string;
}