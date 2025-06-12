// src/modules/funcionalidad/models/crear-funcionalidad.model.ts

export interface CrearFuncionalidadModel {
  nombre: string;
  descripcion?: string;
  ruta?: string;
  activo?: boolean;
  icon?: string;
}