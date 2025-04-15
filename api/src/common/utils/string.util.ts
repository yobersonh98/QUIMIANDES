export const quitarAcentosString = (str:string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const quitarEspaciosString = (str:string) => {
    return str.replace(/\s/g, '');
}

export const quitarCaracteresEspecialesString = (str:string) => {
    return str.replace(/[^\w\s]/gi, '');
}

export const quitarAcentosYEspaciosString = (str:string) => {
    return quitarEspaciosString(quitarAcentosString(str));
}

export const quitarAcentosYEspecialesString = (str:string) => {
    return quitarCaracteresEspecialesString(quitarAcentosString(str));
}

export const esVacio = (str:string) => {
    return !str || str.length === 0 || str.trim().length === 0;
}


/**
 * Función para validar si un valor existe en un enum y retornar el valor del enum, esto sirve para los filtros de prisma por filtro de enums en los modelos
 * @param enumObj enum object para validar el valor
 * @param value  valor a validar, debe ser un string
 * @returns retorna el valor del enum si existe, de lo contrario undefined.
 */
export function getEnumValueOrUndefined<T extends Record<string, string>>(
    enumObj: T,
    value?: string
  ): T[keyof T] | undefined {
    return Object.values(enumObj).includes(value as T[keyof T])
      ? (value as T[keyof T])
      : undefined;
  }
  