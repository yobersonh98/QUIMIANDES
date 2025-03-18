
import * as z from "zod"
export const OrderFormSchema = z.object({
  idCliente: z.string({
    required_error: "Por favor seleccione un cliente",
  }),
  fechaRecibido: z.date({
    required_error: "Por favor seleccione la fecha del pedido",
  }),
  fechaEntregaGlobal: z.date().optional(),
  tipoEntregaGlobal: z.string().optional(),
  lugarEntregaGlobal: z.string(),
  estado: z.string({
    required_error: "Por favor seleccione un estado",
  }),
  ordenCompra: z.string().optional(),
  observaciones: z.string().optional(),
  detallesPedido: z
    .array(
      z.object({
        productoId: z.string({
          required_error: "Por favor seleccione un producto",
        }),
        cantidad: z.string({
          message: 'La cantidad deben purso numeros'
        }),
        fechaEntrega: z.date({
          required_error: "Por favor seleccione una fecha de requerimiento",
        }),
        tipoEntrega: z.string({
          required_error: "Por favor seleccione el tipo de entrega",
        }),
        lugarEntregaId: z.string().optional()
      }),
    )
    .min(1, "Debe agregar al menos un producto"),
})


export type OrderFormValues = z.infer<typeof OrderFormSchema>
