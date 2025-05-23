import { AxiosError, AxiosResponse } from "axios";
import { API } from "@/lib/Api";
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError, UnknownError } from "@/core/errors/errors";
import { GetServerSession } from "@/auth/get-server-session";

export type RequestParams = {
    method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
    endpoint?: string;
    data?: any;
    searchParams?: Record<string, string | number | boolean>;
    defaultErrorResponse?: any;
    isPublic?: boolean;
};

export class ApiService {
    constructor(protected readonly pathName: string, private token?: string) { }

    private getClientFriendlyMessage(message: string): string {
    const fieldMap: Record<string, string> = {
        'idCliente': 'El cliente',
        'fechaEntrega': 'La fecha de entrega',
        'fechaRecibido': 'La fecha de recepción',
        'pedidoId': 'La referencia del pedido',
        'productoId': 'El producto',
        'cantidad': 'La cantidad',
        'pesoTotal': 'El peso',
        'tipoEntrega': 'El tipo de entrega',
        'detallesPedido': 'Los productos',
        'lugarEntregaId': 'El lugar de entrega',
        'unidades': 'Las unidades'
    };

    const errorMap: Record<string, string> = {
        'should not be empty': 'es obligatorio',
        'must be a string': 'debe ser un texto válido',
        'must be a number': 'debe ser un número',
        'must be a positive number': 'debe ser positivo',
        'must not be less than 1': 'debe ser al menos 1',
        'must be a Date instance': 'no es una fecha válida',
        'must be a valid ISO 8601 date string': 'no tiene el formato de fecha correcto'
    };

    // Detecta si el error proviene de un campo dentro de un array (ej: detallesPedido.0.productoId)
    const arrayFieldMatch = message.match(/^(\w+)\.(\d+)\.(\w+)/);
    if (arrayFieldMatch) {
        const [, , , subField] = arrayFieldMatch;
        const readableField = fieldMap[subField] || subField;
        const matchedError = Object.entries(errorMap).find(([key]) => message.includes(key));
        const readableError = matchedError ? matchedError[1] : 'tiene un error';
        return `${readableField} ${readableError}`;
    }

    // Detecta campos simples (ej: idCliente should not be empty)
    const fieldMatch = message.match(/^(\w+)/);
    if (fieldMatch) {
        const field = fieldMatch[1];
        const readableField = fieldMap[field] || field;
        const matchedError = Object.entries(errorMap).find(([key]) => message.includes(key));
        const readableError = matchedError ? matchedError[1] : 'tiene un error';
        return `${readableField} ${readableError}`;
    }

    return 'Error de validación desconocido';
}

private simplifyErrors(messages: string[] | string): string {
    if (Array.isArray(messages)) {
        const processedErrors = messages.map(msg => this.getClientFriendlyMessage(msg));
        const uniqueErrors = [...new Set(processedErrors)].slice(0, 12);

        let result = "Revise los siguientes datos:\n";
        result += uniqueErrors.map(err => `• ${err}`).join('\n');

        if (processedErrors.length > 3) {
            result += `\n• Complete los ${processedErrors.length} campos requeridos`;
        }

        return result;
    }

    return messages;
}


    protected async authHeaders() {
        if (!this.token) {
            this.token = await GetServerSession().then(session => session?.token);
        }
        return {
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        };
    }
    
    /**
     * Makes an API request with the given parameters.
     * @param endpoint - The API endpoint to request.
     * @param method - The HTTP method to use for the request.
     * @param data - The data to send with the request (for POST and PUT methods).
     * @param searchParams - Query parameters to append to the URL.
     * @param defaultErrorResponse - A default response to return in case of an error.
     * @param isPublic - Indicates whether the endpoint is public (doesn't require authentication).
     * @returns A Promise that resolves with the response data.
     * @throws {ResponseError} If an error occurs during the request.
     */
    protected async makeRequest<T>(request?: RequestParams): Promise<T> {
        const { method = 'get', endpoint = '', data = {}, searchParams, defaultErrorResponse, isPublic } = request || {};
        try {
            const headers = isPublic ? {} : await this.authHeaders();
            let url = `${this.pathName}${endpoint}`;
            // Add search params to the URL if provided
            if (searchParams) {
                const searchParamsString = new URLSearchParams(
                    Object.entries(searchParams).map(([key, value]) => [key, String(value)])
                ).toString();
                url += `?${searchParamsString}`;
            }

            const config = {
                ...headers,
                ...(method === 'get' || method === 'delete' ? { params: data } : {})
            };

            const response: AxiosResponse<T> = await API[method](
                url,
                method === 'get' || method === 'delete' ? config : data,
                method === 'post' || method === 'put' || method === "patch" ? config : undefined
            );
            return response.data;
        } catch (error) {
            if (defaultErrorResponse) {
                return defaultErrorResponse;
            }
            this.handlerError(error);
            throw error; // Re-throw the error after handling
        }
    }

    protected handlerError(error: unknown) {
        if (error instanceof AxiosError) {
            const response = error.response;
            console.error('ResponseError: ', response)
            
            if (!response) {
                throw new UnknownError("Problema de conexión con el servidor");
            }

            switch (response.status) {
                case 400:
                    const errorMessage = this.simplifyErrors(response.data?.message || response.data);
                    throw new BadRequestError(errorMessage);
                case 401:
                    throw new UnauthorizedError(response.data?.message || "Acceso no autorizado");
                case 404:
                    throw new NotFoundError(response.data?.message || "No se encontró lo solicitado");
                case 409:
                    throw new ConflictError(response.data?.message || "Datos en conflicto");
                default:
                    throw new UnknownError(response.data?.message || "Error en el servidor");
            }
        }
        
        throw new UnknownError("Error inesperado");
    }
}