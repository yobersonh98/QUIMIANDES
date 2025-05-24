/**
 * Agrupa un array de objetos por una clave específica
 * @param array - Array de objetos a agrupar
 * @param key - Clave por la cual agrupar
 * @returns Objeto con los elementos agrupados
 */
export function groupBy<T, K extends keyof T>(
  array: T[], 
  key: K
): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

// Versión alternativa más flexible que acepta funciones
export function groupByFn<T, K>(
  array: T[], 
  keyOrFn: keyof T | ((item: T) => K)
): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = typeof keyOrFn === 'function' 
      ? String(keyOrFn(item))
      : String(item[keyOrFn]);
    
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}
