import { AxiosError, AxiosResponse } from "axios";
import { API } from "@/lib/Api";
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError, UnknownError } from "@/core/errors/errors";
import { GetServerSession } from "@/auth/get-server-session";

/**
 * Defines the parameters for making an API request.
 */
export type RequestParams = {
    method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
    endpoint?: string;
    data?: any;
    searchParams?: Record<string, string | number | boolean>;
    defaultErrorResponse?: any;
    isPublic?: boolean;
}

/**
 * ApiService class for handling API requests.
 */
export class ApiService {
    /**
     * Creates an instance of ApiService.
     * @param pathName - The base path for API endpoints.
     * @param token - The user's token for authentication if you want use in client enviroment.
     */
    constructor(protected readonly pathName: string, private token?:string) { }

    /**
     * Retrieves authentication headers for API requests.
     * @returns An object containing the Authorization header with the user's token.
     */
    protected async authHeaders() {
        if (!this.token) {
            this.token = await GetServerSession().then(session => session.token)
        }
        return {
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        }
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

    /**
     * Handles errors that occur during API requests.
     * @param error - The error object to handle.
     * @throws {ResponseError} With appropriate error type and message.
     */
    protected handlerError(error: unknown) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 401) {
                throw new UnauthorizedError(error.response.data?.message || "Unauthorized");
            }
            if (error.response?.status === 404) {
                throw new NotFoundError(error.response.data?.message || "Not found");
            }
            if (error.response?.status === 409) {
                throw new ConflictError(error.response.data?.message || "Conflict");
            }
            if (error.response?.status === 400) {
                throw new BadRequestError(error.response.data?.message || "Bad request");
            }
            throw new UnknownError(error.response?.data?.message || "Unknown error");
        }
        throw new UnknownError(error instanceof Error ? error.message : "Unknown error");
    }
}