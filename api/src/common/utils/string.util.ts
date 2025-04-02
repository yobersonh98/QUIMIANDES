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
