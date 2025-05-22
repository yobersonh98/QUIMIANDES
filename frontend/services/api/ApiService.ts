import { AxiosError, AxiosResponse } from "axios";
import { API } from "@/lib/Api";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  UnknownError,
} from "@/core/errors/errors";
import { GetServerSession } from "@/auth/get-server-session";

/**
 * Defines the parameters for making an API request.
 */
export type RequestParams<T = unknown, D = unknown> = {
  method?: "get" | "post" | "put" | "delete" | "patch";
  endpoint?: string;
  data?: D;
  searchParams?: Record<string, string | number | boolean>;
  defaultErrorResponse?: T;
  isPublic?: boolean;
};

/**
 * ApiService class for handling API requests.
 */
export class ApiService {
  /**
   * Creates an instance of ApiService.
   * @param pathName - The base path for API endpoints.
   * @param token - The user's token for authentication if you want use in client environment.
   */
  constructor(protected readonly pathName: string, private token?: string) {}

  /**
   * Retrieves authentication headers for API requests.
   * @returns An object containing the Authorization header with the user's token.
   */
  protected async authHeaders() {
    if (!this.token) {
      this.token = await GetServerSession().then((session) => session.token);
    }
    return {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    };
  }

  /**
   * Makes an API request with the given parameters.
   * @param request - The request parameters.
   * @returns A Promise that resolves with the response data.
   * @throws {ResponseError} If an error occurs during the request.
   */
  protected async makeRequest<T = unknown, D = unknown>(
  request?: RequestParams<T, D>
): Promise<T> {
  const {
    method = "get",
    endpoint = "",
    data = {} as D,
    searchParams,
    defaultErrorResponse,
    isPublic,
  } = request || {};

  try {
    const headers = isPublic ? {} : await this.authHeaders();
    let url = `${this.pathName}${endpoint}`;

    // Add search params to the URL if provided
    if (searchParams) {
      const searchParamsString = new URLSearchParams(
        Object.entries(searchParams).map(([key, value]) => [
          key,
          String(value),
        ])
      ).toString();
      url += `?${searchParamsString}`;
    }

    // Configuración base para todas las solicitudes
    const baseConfig = {
      ...headers,
      url,
    };

    let response: AxiosResponse<T>;

    switch (method) {
      case "get":
      case "delete":
        response = await API[method]<T>(url, {
          ...baseConfig,
          params: data,
        });
        break;
      case "post":
      case "put":
      case "patch":
        response = await API[method]<T>(url, data, baseConfig);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return response.data;
  } catch (error) {
    if (defaultErrorResponse) {
      return defaultErrorResponse;
    }
    this.handlerError(error);
    throw error;
  }
}

  /**
   * Handles errors that occur during API requests.
   * @param error - The error object to handle.
   * @throws {ResponseError} With appropriate error type and message.
   */
  protected handlerError(error: unknown): never {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data as { message?: string };

      switch (error.response?.status) {
        case 400:
          throw new BadRequestError(
            this.transformValidationErrors(errorData?.message || "Bad request")
          );
        case 401:
          throw new UnauthorizedError(errorData?.message || "Unauthorized");
        case 404:
          throw new NotFoundError(errorData?.message || "Not found");
        case 409:
          throw new ConflictError(errorData?.message || "Conflict");
        default:
          throw new UnknownError(errorData?.message || "Unknown error");
      }
    }

    throw new UnknownError(
      error instanceof Error ? error.message : "Unknown error"
    );
  }

  /**
   * Transforms validation error messages into user-friendly messages.
   * @param errorMessage - The original error message.
   * @returns A user-friendly error message.
   */
  private transformValidationErrors(errorMessage: string): string {
    const errorMap: Record<string, string> = {
      "detailedPedido.0.productold should not be empty":
        "Por favor, seleccione un producto",
      "detallesPedido.0.pesoTotal must be a positive number":
        "El peso total debe ser un número positivo",
      "detallesPedido.0.tipoEntrega should not be empty":
        "Por favor, seleccione un tipo de entrega",
    };

    // Check for exact matches first
    if (errorMap[errorMessage]) {
      return errorMap[errorMessage];
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(errorMap)) {
      if (errorMessage.includes(key)) {
        return value;
      }
    }

    // Handle multiple errors concatenated
    const errorParts = errorMessage.split(/(?=[a-z])/);
    const friendlyErrors: string[] = [];

    errorParts.forEach(part => {
      part = part.trim();
      if (!part) return;

      for (const [key, value] of Object.entries(errorMap)) {
        if (part.includes(key)) {
          friendlyErrors.push(value);
          return;
        }
      }
    });

    return friendlyErrors.length > 0
      ? friendlyErrors.join(". ")
      : "Por favor, verifique los datos ingresados. Hay errores en el formulario.";
  }
}