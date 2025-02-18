import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Producto {
  id: string;
  nombre: string;
  tipo: string;
  unidadMedida: string;
  pesoVolumen: number;
  precioBase: number;
}

export interface InventarioCliente {
  id: string;
  producto: Producto;
  precioEspecial: number;
}

export interface DetallePedido {
  id: string;
  producto: Producto;
  unidades: number;
  cantidad: number;
  total: number;
}

export interface Pedido {
  id: string;
  fechaRecibido: string;
  estado: string;
  observaciones?: string;
  fechaRequerimiento: string;
  fechaEntrega?: string;
  pesoDespachado?: number;
  productos: DetallePedido[];
}

export interface DetalleCotizacion {
  id: string;
  producto: Producto;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Cotizacion {
  id: string;
  fecha: string;
  total: number;
  detalles: DetalleCotizacion[];
}

export interface Cliente {
  documento: string;
  tipoDocumento: string;
  nombre: string;
  direccion: string;
  zonaBarrio?: string;
  inventarios: InventarioCliente[];
  pedidos: Pedido[];
  cotizaciones: Cotizacion[];
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Client"],
  endpoints: (build) => ({
    getClients: build.query<Cliente[], string | void>({
      query: (search) => ({
        url: "client",
        params: search ? { search } : {},
      }),
      providesTags: ["Client"],
    }),
    getClientById: build.query<Cliente, string>({
      query: (documento) => `client/${documento}`,
      providesTags: ["Client"],
    }),
    createClient: build.mutation<Cliente, Partial<Cliente>>({
      query: (newClient) => ({
        url: "client",
        method: "POST",
        body: newClient,
      }),
      invalidatesTags: ["Client"],
    }),
    deleteClient: build.mutation<void, string>({
      query: (documento) => ({
        url: `client/${documento}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Client"],
    }),
  }),
});

export const { useGetClientsQuery, useGetClientByIdQuery, useCreateClientMutation, useDeleteClientMutation } = api;
